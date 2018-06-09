import * as ESTree from '../estree';
import { AssignmentProperty } from './../estree';
import { Parser } from '../types';
import { Token, tokenDesc } from '../token';
import { parseAssignmentPattern, parseDelimitedBindingList, parseBindingIdentifier } from './pattern';
import { parseStatementListItem, parseDirective, parseVariableStatement } from './statements';
import { parseClassDeclaration, parseFunctionDeclaration } from './declarations';
import { parseAssignmentExpression, parseLiteral, parseIdentifier } from './expressions';
import { Errors, recordErrors, } from '../errors';
import {
    expect,
    Context,
    nextToken,
    consume,
    consumeSemicolon,
    lookahead,
    nextTokenIsFuncKeywordOnSameLine,
    nextTokenIsLeftParenOrPeriod,
    ModifierState,
    BindingOrigin,
    BindingType,
    parseIdentifierName
} from '../common';

export function parseModuleItemList(parser: Parser, context: Context) {
    // Prime the scanner
    nextToken(parser, context);

    const statements: any[] = [];

    while (parser.token !== Token.EndOfSource) {
        statements.push((parser.token & Token.StringLiteral) === Token.StringLiteral ?
            parseDirective(parser, context) :
            parseModuleItem(parser, context));
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
export function parseModuleItem(parser: Parser, context: Context): any {

    switch (parser.token) {

        // @decorator
        case Token.At:
            //  return parseDecorators(parser, context);

            // ExportDeclaration
        case Token.ExportKeyword:
            return parseExportDeclaration(parser, context);

            // ImportDeclaration
        case Token.ImportKeyword:
            // 'Dynamic Import' or meta property disallowed here
            if (!(context & Context.OptionsNext && lookahead(parser, context, nextTokenIsLeftParenOrPeriod))) {
                return parseImportDeclaration(parser, context);
            }
            // falls through
        default:
            return parseStatementListItem(parser, context);
    }
}

/**
 * Parse export declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseExportDeclaration(parser: Parser, context: Context): any {
    // ExportDeclaration:
    // export * FromClause;
    // export ExportClause FromClause;
    // export VariableStatement
    // export Declaration
    // export HoistableDeclaration
    // export ClassDeclaration
    // export AssignmentExpression
    const specifiers: ESTree.ExportSpecifier[] = [];

    let source: ESTree.Literal | null = null;
    let declaration: ESTree.Statement | null = null;

    expect(parser, context, Token.ExportKeyword);

    switch (parser.token) {

        case Token.Multiply:
            // export * from 'foo';
            return parseExportAllDeclaration(parser, context);

        case Token.DefaultKeyword:
            return parseExportDefault(parser, context);

        case Token.LeftBrace:
            {
                // export {}
                // export {} from 'foo'
                expect(parser, context, Token.LeftBrace);

                let hasReservedWord = false;

                while (parser.token !== Token.RightBrace) {
                    if (parser.token & Token.Reserved) {
                        hasReservedWord = true;
                    }
                    specifiers.push(parseNamedExportDeclaration(parser, context));
                    if (parser.token !== Token.RightBrace) expect(parser, context, Token.Comma);
                }

                expect(parser, context, Token.RightBrace);

                if (parser.token === Token.FromKeyword) {
                    source = parseModuleSpecifier(parser, context);
                    //  The left hand side can't be a keyword where there is no
                    // 'from' keyword since it references a local binding.
                } else if (hasReservedWord) recordErrors(parser, context, Errors.UnexpectedReserved);

                consumeSemicolon(parser, context);

                break;
            }
        case Token.ClassKeyword:
            // export class foo {}
            declaration = (parseClassDeclaration(parser, context));
            break;

        case Token.LetKeyword:
            // export let z = 0;
            // export let x
            declaration = parseVariableStatement(parser, context, BindingType.Let, BindingOrigin.Export);
            break;

        case Token.ConstKeyword:
            // export const z = 0;
            // export const x
            declaration = parseVariableStatement(parser, context, BindingType.Const, BindingOrigin.Export);
            break;

        case Token.VarKeyword:
            // export var ariya = 123;
            // export var a, b, c;
            declaration = parseVariableStatement(parser, context, BindingType.Var, BindingOrigin.Export);
            break;

            // export HoistableDeclaration
        case Token.FunctionKeyword:
            // export function foo () {}
            // export function () {}
            // export function *foo() {}
            // export function *() {}
            declaration = parseFunctionDeclaration(parser, context);
            break;

        case Token.AsyncKeyword:
            // export async function *foo () {}
            // export async function foo () {}
            // export async function *() {}
            // export async function f(){}
            // export async function(){}
            // export async () => y
            // export async (x) => y
            // export async x => y
            if (lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, false)) {
                declaration = parseFunctionDeclaration(parser, context, ModifierState.Async);
                break;
            }
            // Falls through
        default:
            recordErrors(parser, context, Errors.UnexpectedToken, tokenDesc(parser.token));
    }

    return {
        type: 'ExportNamedDeclaration',
        source,
        specifiers,
        declaration,
    };
}

/**
 * Parse export all declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseExportAllDeclaration(parser: Parser, context: Context): ESTree.ExportAllDeclaration {
    expect(parser, context, Token.Multiply);
    const source = parseModuleSpecifier(parser, context);
    consumeSemicolon(parser, context);
    return {
        type: 'ExportAllDeclaration',
        source,
    };
}

/**
 * Parse named export declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseNamedExportDeclaration(parser: Parser, context: Context): ESTree.ExportSpecifier {
    // ExportSpecifier :
    // IdentifierName
    // IdentifierName as IdentifierName
    const local = parseIdentifierName(parser, context, parser.token);
    const exported = consume(parser, context, Token.AsKeyword) ?
        parseIdentifierName(parser, context, parser.token) :
        local;
    return {
        type: 'ExportSpecifier',
        local,
        exported,
    };
}

/**
 * Parse export default
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-HoistableDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-HoistableDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param pos Location
 */
function parseExportDefault(parser: Parser, context: Context): ESTree.ExportDefaultDeclaration {

    expect(parser, context, Token.DefaultKeyword);

    let declaration: ESTree.FunctionDeclaration | ESTree.ClassDeclaration | ESTree.Expression;

    switch (parser.token) {

        // export default HoistableDeclaration[Default]
        case Token.FunctionKeyword:
            declaration = parseFunctionDeclaration(parser, context | Context.RequireIdentifier);
            break;

            // export default ClassDeclaration[Default]
            // export default  @decl ClassDeclaration[Default]
        case Token.At:
        case Token.ClassKeyword:
            declaration = parseClassDeclaration(parser, context | Context.RequireIdentifier);
            break;

            // export default HoistableDeclaration[Default]
        case Token.AsyncKeyword:
            declaration = parseAsyncFunctionOrAssignmentExpression(parser, context | Context.RequireIdentifier);
            break;

        default:
            // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
            declaration = parseAssignmentExpression(parser, context);

            consumeSemicolon(parser, context);
    }

    return {
        type: 'ExportDefaultDeclaration',
        declaration,
    };
}

/**
 * Parse import declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseImportDeclaration(parser: Parser, context: Context): ESTree.ImportDeclaration {
    expect(parser, context, Token.ImportKeyword);

    let source: ESTree.Literal;
    const specifiers: ESTree.Specifiers[] = [];

    // 'import' ModuleSpecifier ';'
    if ((parser.token & Token.Identifier) === Token.Identifier) {

        specifiers.push(parseImportDefaultSpecifier(parser, context));

        if (consume(parser, context, Token.Comma)) {
            if (parser.token === Token.Multiply) {
                parseNameSpaceImport(parser, context, specifiers);
            } else if (parser.token === Token.LeftBrace) {
                parseNamedImports(parser, context, specifiers);
            } else recordErrors(parser, context, Errors.UnexpectedToken, tokenDesc(parser.token));
        }

        source = parseModuleSpecifier(parser, context);

        // 'import' ModuleSpecifier ';'
    } else if ((parser.token & Token.StringLiteral) === Token.StringLiteral) {
        source = parseLiteral(parser, context);
    } else {
        if (parser.token === Token.Multiply) {
            parseNameSpaceImport(parser, context, specifiers);
        } else if (parser.token === Token.LeftBrace) {
            parseNamedImports(parser, context, specifiers);
        } else recordErrors(parser, context, Errors.UnexpectedToken, tokenDesc(parser.token));

        source = parseModuleSpecifier(parser, context);
    }

    consumeSemicolon(parser, context);

    return {
        type: 'ImportDeclaration',
        specifiers,
        source,
    };
}

/**
 * Parse named imports
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NamedImports)
 *
 * @param parser  Parser object
 * @param context Context masks
 */

function parseNamedImports(parser: Parser, context: Context, specifiers: ESTree.Specifiers[]): void {

    expect(parser, context, Token.LeftBrace);

    while (parser.token !== Token.RightBrace) {
        specifiers.push(parseImportSpecifier(parser, context));
        if (parser.token !== Token.RightBrace) expect(parser, context, Token.Comma);
    }

    expect(parser, context, Token.RightBrace);
}

/**
 * Parse import specifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportSpecifier)
 *
 * @param parser  Parser object
 * @param context Context masks
 */

function parseImportSpecifier(parser: Parser, context: Context): ESTree.ImportSpecifier {

    const {
        token
    } = parser;
    const imported = parseIdentifierName(parser, context, parser.token);

    let local: ESTree.Identifier;

    if (consume(parser, context, Token.AsKeyword)) {
        local = parseBindingIdentifier(parser, context);
    } else {
        // An import name that is a keyword is a syntax error if it is not followed
        // by the keyword 'as'.
        if ((token & Token.Reserved) === Token.Reserved) recordErrors(parser, context, Errors.Unexpected);
        local = imported;
    }

    return {
        type: 'ImportSpecifier',
        local,
        imported,
    };
}

/**
 * Parse binding identifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NameSpaceImport)
 *
 * @param parser  Parser object
 * @param context Context masks
 */

function parseNameSpaceImport(parser: Parser, context: Context, specifiers: ESTree.Specifiers[]): void {
    // NameSpaceImport:
    //  * as ImportedBinding
    expect(parser, context, Token.Multiply);
    expect(parser, context, Token.AsKeyword, Errors.AsAfterImportStart);
    const local = parseBindingIdentifier(parser, context);
    specifiers.push({
        type: 'ImportNamespaceSpecifier',
        local,
    });
}

/**
 * Parse module specifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleSpecifier)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseModuleSpecifier(parser: Parser, context: Context): ESTree.Literal {
    // ModuleSpecifier :
    //   StringLiteral
    expect(parser, context, Token.FromKeyword);
    if ((parser.token & Token.StringLiteral) !== Token.StringLiteral) {
        recordErrors(parser, context, Errors.UnexpectedToken, tokenDesc(parser.token));
    }
    return parseLiteral(parser, context);
}

/**
 * Parse import default specifier
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseImportDefaultSpecifier(parser: Parser, context: Context): ESTree.ImportDefaultSpecifier {
    return {
        type: 'ImportDefaultSpecifier',
        local: parseIdentifier(parser, context),
    };
}

/**
 * Parses either async function or assignment expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentExpression)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncFunctionDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncGeneratorDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAsyncFunctionOrAssignmentExpression(
    parser: Parser,
    context: Context
): ESTree.FunctionDeclaration | ESTree.AssignmentExpression {
    return lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, false) ?
        parseFunctionDeclaration(parser, context | Context.RequireIdentifier, ModifierState.Async) :
        parseAssignmentExpression(parser, context) as any;
}