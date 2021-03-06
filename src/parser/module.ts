import * as ESTree from '../estree';
import { ParserState, Location } from '../types';
import { parseLiteral, parseIdentifier, parseAssignmentExpression } from './expressions';
import { Token } from '../token';
import { nextToken } from '../lexer/scan';
import { parseFunctionDeclaration, parseClassDeclaration } from './declarations';
import { lookAheadOrScan } from '../lexer/common';
import { parseBindingIdentifier } from './pattern';
import { Errors, report } from '../errors';
import { parseVariableStatement, parseStatementListItem } from './statements';
import { parseDirective } from './directives';
import {
  Context,
  finishNode,
  getLocation,
  consumeSemicolon,
  nextTokenIsFuncKeywordOnSameLine,
  nextTokenIsLeftParenOrPeriod,
  expect,
  optional,
  BindingOrigin,
  BindingType,
} from '../common';

/**
 * Parse module item list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleItemList)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseModuleItemList(state: ParserState, context: Context): ESTree.Statement[] {
  nextToken(state, context);
  const statements: ESTree.Statement[] = [];
  while (state.token !== Token.EndOfSource) {
      statements.push(state.token & Token.StringLiteral ?
          parseDirective(state, context) :
          parseModuleItem(state, context));
  }
  return statements;
}

/**
 * Parse module item
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleItem)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseModuleItem(state: ParserState, context: Context): ReturnType<
| typeof parseExportDeclaration
| typeof parseImportDeclaration
| typeof parseStatementListItem  > {

    switch (state.token) {
            // ExportDeclaration
        case Token.ExportKeyword:
            return parseExportDeclaration(state, context);

            // ImportDeclaration
        case Token.ImportKeyword:
            // `import("...")` call or `import.meta` meta property disallowed here
            if ((context & Context.OptionsNext) < 1 && !lookAheadOrScan(state, context, nextTokenIsLeftParenOrPeriod, true)) {
                return parseImportDeclaration(state, context);
            }
            // falls through
        default:
            return parseStatementListItem(state, context);
    }
}

/**
 * Parse export declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExportDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-HoistableDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-HoistableDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseExportDeclaration(state: ParserState, context: Context): any {
  // ExportDeclaration:
  // export * FromClause;
  // export ExportClause FromClause;
  // export VariableStatement
  // export Declaration
  // export HoistableDeclaration
  // export ClassDeclaration
  // export AssignmentExpression

  const pos = getLocation(state);
  const specifiers: ESTree.ExportSpecifier[] = [];

  let source: ESTree.Literal | null = null;
  let declaration: ESTree.Statement | ESTree.FunctionDeclaration | ESTree.ClassDeclaration | ESTree.Expression | null = null;

  expect(state, context, Token.ExportKeyword);

  if (optional(state, context, Token.DefaultKeyword)) {

      switch (state.token) {

          // export default HoistableDeclaration[Default]
          case Token.FunctionKeyword:
              declaration = parseFunctionDeclaration(state, context | Context.RequireIdentifier, false);
              break;

              // export default ClassDeclaration[Default]
          case Token.ClassKeyword:
              declaration = parseClassDeclaration(state, context | Context.RequireIdentifier);
              break;

              // export default HoistableDeclaration[Default]
          case Token.AsyncKeyword:
              declaration = parseAsyncFunctionOrAssignmentExpression(state, context | Context.RequireIdentifier);
              break;

          default:
              // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
              declaration = parseAssignmentExpression(state, context);
              consumeSemicolon(state, context);
      }

      return finishNode(state, context, pos, {
          type: 'ExportDefaultDeclaration',
          declaration,
      });
  }

  switch (state.token) {

      // export * from 'fkleuver';
      case Token.Multiply:
          {
              nextToken(state, context);
              source = parseModuleSpecifier(state, context);
              consumeSemicolon(state, context);
              return finishNode(state, context, pos, {
                  type: 'ExportAllDeclaration',
                  source,
              });
          }

          // export ExportClause FromClause ;
          // export ExportClause ;
          //
          // ExportClause :
          // { }
          // { ExportsList }
          // { ExportsList , }
          //
          // ExportsList :
          // ExportSpecifier
          // ExportsList , ExportSpecifier
      case Token.LeftBrace:
          {
              nextToken(state, context);
              let hasKeywordForLocalBindings = false;
              while (state.token !== Token.RightBrace) {
                  if (!(state.token & (Token.Identifier | Token.Keyword))) report(state, Errors.Unexpected);
                  if (state.token & Token.Reserved) hasKeywordForLocalBindings = true;
                  const bracePos = getLocation(state);
                  const local = parseIdentifier(state, context);
                  let exported: ESTree.Identifier | null;
                  if (state.token === Token.AsKeyword) {
                      nextToken(state, context);
                      if (!(state.token & (Token.Identifier | Token.Keyword))) report(state, Errors.Unexpected);
                      exported = parseIdentifier(state, context);
                  } else exported = local;

                  specifiers.push(finishNode(state, context, bracePos, {
                      type: 'ExportSpecifier',
                      local,
                      exported,
                  }));

                  if (state.token !== Token.RightBrace) expect(state, context, Token.Comma);
              }

              expect(state, context, Token.RightBrace);

              if (state.token === Token.FromKeyword) {
                  nextToken(state, context);
                  //  The left hand side can't be a keyword where there is no
                  // 'from' keyword since it references a local binding.
                  if ((state.token & Token.StringLiteral) !== Token.StringLiteral) report(state, Errors.Unexpected);
                  source = parseLiteral(state, context);
              } else if (hasKeywordForLocalBindings) report(state, Errors.Unexpected);

              consumeSemicolon(state, context);

              break;
          }

          // export class ...
      case Token.ClassKeyword:
          declaration = (parseClassDeclaration(state, context));
          break;

          // export let z = 0;
          // export let x
      case Token.LetKeyword:
          declaration = parseVariableStatement(state, context, BindingType.Let, BindingOrigin.Export);
          break;

          // export const z = 0;
          // export const x
      case Token.ConstKeyword:
          declaration = parseVariableStatement(state, context, BindingType.Const, BindingOrigin.Export);
          break;

          // export var ariya = 123;
          // export var a, b, c;
      case Token.VarKeyword:
          declaration = parseVariableStatement(state, context, BindingType.Var, BindingOrigin.Export);
          break;

          // export function foo () {}
          // export function () {}
          // export function *foo() {}
          // export function *() {}
      case Token.FunctionKeyword:
          declaration = parseFunctionDeclaration(state, context, false);
          break;

          // export async function *foo () {}
          // export async function foo () {}
          // export async function *() {}
          // export async function f(){}
          // export async function(){}
          // export async () => y
          // export async (x) => y
          // export async x => y
      case Token.AsyncKeyword:
          {
              const pos = getLocation(state);
              const line = state.line;
              nextToken(state, context);
              if (state.line === line) {
                  declaration = parseFunctionDeclaration(state, context, true, pos);
                  break;
              }
          }
          // Falls through
      default:
          report(state, Errors.Unexpected);
  }

  return finishNode(state, context, pos, {
      type: 'ExportNamedDeclaration',
      source,
      specifiers,
      declaration,
  });
}

/**
 * Parse import declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseImportDeclaration(state: ParserState, context: Context): ESTree.ImportDeclaration {
    const pos = getLocation(state);
    expect(state, context, Token.ImportKeyword);

    let source: ESTree.Literal;
    const specifiers: ESTree.Specifiers[] = [];

    // 'import' ModuleSpecifier ';'
    if (state.token & Token.Identifier) {
        specifiers.push(finishNode(state, context, getLocation(state), {
          type: 'ImportDefaultSpecifier',
          local: parseIdentifier(state, context),
      }));

        if (optional(state, context, Token.Comma)) {
            if (state.token === Token.Multiply) {
                parseImportNamespace(state, context, specifiers);
            } else if (state.token === Token.LeftBrace) {
                parseImportSpecifierOrNamedImports(state, context, specifiers);
            } else report(state, Errors.Unexpected);
        }

        source = parseModuleSpecifier(state, context);

        // 'import' ModuleSpecifier ';'
    } else if (state.token & Token.StringLiteral) {
        source = parseLiteral(state, context);
    } else {
        if (state.token === Token.Multiply) {
            parseImportNamespace(state, context, specifiers);
        } else if (state.token === Token.LeftBrace) {
            parseImportSpecifierOrNamedImports(state, context, specifiers);
        } else report(state, Errors.Unexpected);

        source = parseModuleSpecifier(state, context);
    }

    consumeSemicolon(state, context);

    return finishNode(state, context, pos, {
        type: 'ImportDeclaration',
        specifiers,
        source,
    });
}

/**
 * Parse named imports or import specifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NamedImports)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportSpecifier)
 *
 * @param parser  Parser instance
 * @param context Context masks
 */

function parseImportSpecifierOrNamedImports(state: ParserState, context: Context, specifiers: ESTree.Specifiers[]): void {
  expect(state, context, Token.LeftBrace);
  while (state.token !== Token.RightBrace) {
      const pos = getLocation(state);
      const t = state.token;
      if (!(t & (Token.Identifier | Token.Keyword))) report(state, Errors.Unexpected);
      const imported = parseIdentifier(state, context);
      let local: ESTree.Identifier;
      if (optional(state, context, Token.AsKeyword)) {
          local = parseBindingIdentifier(state, context);
      } else {
          // An import name that is a keyword is a syntax error if it is not followed
          // by the keyword 'as'.
          if (t & Token.Reserved) report(state, Errors.Unexpected);
          local = imported;
      }

      specifiers.push(finishNode(state, context, pos, {
          type: 'ImportSpecifier',
          local,
          imported,
      }));

      if (state.token !== Token.RightBrace) expect(state, context, Token.Comma);
  }

  expect(state, context, Token.RightBrace);
}

/**
 * Parse binding identifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NameSpaceImport)
 *
 * @param parser  Parser instance
 * @param context Context masks
 */

function parseImportNamespace(state: ParserState, context: Context, specifiers: ESTree.Specifiers[]): void {
    // NameSpaceImport:
    //  * as ImportedBinding
    const pos = getLocation(state);
    nextToken(state, context);
    expect(state, context, Token.AsKeyword);
    const local = parseBindingIdentifier(state, context);
    specifiers.push(finishNode(state, context, pos, {
        type: 'ImportNamespaceSpecifier',
        local,
    }));
}

/**
 * Parse module specifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleSpecifier)
 *
 * @param parser  Parser instance
 * @param context Context masks
 */
function parseModuleSpecifier(state: ParserState, context: Context): ESTree.Literal {
    // ModuleSpecifier :
    //   StringLiteral
    expect(state, context, Token.FromKeyword);
    if ((state.token & Token.StringLiteral) !== Token.StringLiteral) report(state, Errors.Unexpected);
    return parseLiteral(state, context);
}

/**
 * Parses either async function or assignment expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentExpression)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncFunctionDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncGeneratorDeclaration)
 *
 * @param parser  Parser instance
 * @param context Context masks
 */
function parseAsyncFunctionOrAssignmentExpression(
  state: ParserState,
  context: Context
): ESTree.FunctionDeclaration | ESTree.AssignmentExpression {
    const pos = getLocation(state);
    return lookAheadOrScan(state, context, nextTokenIsFuncKeywordOnSameLine, false) ?
        parseFunctionDeclaration(state, context | Context.RequireIdentifier, true, pos) :
        parseAssignmentExpression(state, context) as any;
}
