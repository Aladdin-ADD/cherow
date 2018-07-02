import { Parser, Location } from '../types';
import { Token, tokenDesc } from '../token';
import * as ESTree from '../estree';
import { parseIdentifier, parseSequenceExpression, parseExpression, parseAssignmentExpression } from './expressions';
import { Errors, report } from '../errors';
import { parseFunctionDeclaration, parseVariableDeclarationList, parseClassDeclaration } from './declarations';
import { parseBindingIdentifierOrPattern } from './pattern';
import { nextToken } from '../lexer/scan';
import {
    Context,
    Flags,
    expect,
    consume,
    consumeSemicolon,
    LabelledFunctionState,
    BindingType,
    BindingOrigin,
    lookahead,
    isLexical,
    reinterpret,
    nextTokenIsFuncKeywordOnSameLine,
    ModifierState,
    getLabel,
    addLabel,
    LabelState,
    validateContinueLabel,
    validateBreakStatement,
    getLocation,
    finishNode
} from '../common';

/**
 * Parse statement list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementList)
 *
 * @param Parser instance
 * @param Context masks
 */

export function parseStatementList(parser: Parser, context: Context): ESTree.Statement[] {
    nextToken(parser, context);
    const statements: ESTree.Statement[] = [];

    while ((parser.token & Token.StringLiteral) === Token.StringLiteral) {
      const { tokenValue: value } = parser;
      if (!(context & Context.Strict) && value.length === 10 && value === 'use strict') {
            context |= Context.Strict;
      }
      statements.push(parseDirective(parser, context));
    }

    while (parser.token !== Token.EndOfSource) {
      statements.push(parseStatementListItem(parser, context));
    }

    return statements;
}

/**
 * Parses statement list items
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementListItem)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseStatementListItem(parser: Parser, context: Context): ESTree.Statement {
   // ECMA 262 8th Edition
  // StatementListItem[Yield, Return] :
  //   Statement[?Yield, ?Return]
  //   Declaration[?Yield]
  //
  // Declaration[Yield] :
  //   HoistableDeclaration[?Yield]
  //   ClassDeclaration[?Yield]
  //   LexicalDeclaration[In, ?Yield]
  //
  // HoistableDeclaration[Yield, Default] :
  //   FunctionDeclaration[?Yield, ?Default]
  //   GeneratorDeclaration[?Yield, ?Default]
  //
  // LexicalDeclaration[In, Yield] :
  //   LetOrConst BindingList[?In, ?Yield] ;
    switch (parser.token) {
        case Token.FunctionKeyword:
            return parseFunctionDeclaration(parser, context);
        case Token.ClassKeyword:
            return parseClassDeclaration(parser, context);
        case Token.ConstKeyword:
            return parseVariableStatement(parser, context, BindingType.Const);
        case Token.LetKeyword:
            return parseLetOrExpressionStatement(parser, context);
        case Token.SwitchKeyword:
            return parseSwitchStatement(parser, context);
        case Token.AsyncKeyword:
            return parseAsyncFunctionDeclarationOrStatement(parser, context);
        default:
            return parseStatement(parser, context, LabelledFunctionState.Allow);
    }
}

/**
 * Parses statements
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseStatement(
    parser: Parser,
    context: Context,
    label: LabelledFunctionState = LabelledFunctionState.Disallow
): ESTree.Statement {
  // Statement ::
  //   Block
  //   VariableStatement
  //   EmptyStatement
  //   ExpressionStatement
  //   IfStatement
  //   IterationStatement
  //   ContinueStatement
  //   BreakStatement
  //   ReturnStatement
  //   WithStatement
  //   LabelledStatement
  //   SwitchStatement
  //   ThrowStatement
  //   TryStatement
  //   DebuggerStatement

    switch (parser.token) {
        case Token.VarKeyword:
            return parseVariableStatement(parser, context, BindingType.Var);
        case Token.TryKeyword:
            return parseTryStatement(parser, context);
        case Token.Semicolon:
            return parseEmptyStatement(parser, context);
        case Token.ReturnKeyword:
            return parseReturnStatement(parser, context);
        case Token.LeftBrace:
            return parseBlockStatement(parser, context);
        case Token.DebuggerKeyword:
            return parseDebuggerStatement(parser, context);
        case Token.ForKeyword:
            return parseForStatement(parser, context);
        case Token.WhileKeyword:
            return parseWhileStatement(parser, context);
        case Token.DoKeyword:
            return parseDoWhileStatement(parser, context);
        case Token.IfKeyword:
            return parseIfStatement(parser, context);
        case Token.BreakKeyword:
            return parseBreakStatement(parser, context);
        case Token.ContinueKeyword:
            return parseContinueStatement(parser, context);
        case Token.WithKeyword:
            return parseWithStatement(parser, context);
        case Token.ThrowKeyword:
            return parseThrowStatement(parser, context);
        case Token.AsyncKeyword:
            if (lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, /* isLookaHead */ false)) {
                if (context & Context.OptionsEditorMode) return parseFunctionDeclaration(parser, context, ModifierState.Async);
                report(parser, Errors.AsyncFunctionInSingleStatementContext);
            }
            return parseExpressionOrLabelledStatement(parser, context, label);
        case Token.FunctionKeyword:
            // A function declaration has to be parsed out for 'editor mode'
            if (context & Context.OptionsEditorMode) return parseFunctionDeclaration(parser, context | Context.RequireIdentifier);
            report(parser, context & Context.Strict ? Errors.StrictFunction : Errors.SloppyFunction);
        case Token.ClassKeyword:
            report(parser, Errors.Unexpected);
        default:
            return parseExpressionOrLabelledStatement(parser, context, label);
    }
}

/**
 * Parses the debugger statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-DebuggerStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseDebuggerStatement(parser: Parser, context: Context): ESTree.DebuggerStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    consumeSemicolon(parser, context);
    return finishNode(parser, context, pos, {
        type: 'DebuggerStatement'
    });
}

/**
 * Parses block statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BlockStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Block)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBlockStatement(parser: Parser, context: Context): ESTree.BlockStatement {
    const pos = getLocation(parser);
    const body: ESTree.Statement[] = [];
    nextToken(parser, context);
    while (parser.token !== Token.RightBrace) {
        body.push(parseStatementListItem(parser, context));
    }
    expect(parser, context, Token.RightBrace);

    return finishNode(parser, context, pos, {
        type: 'BlockStatement',
        body
    });
}

/**
 * Parses return statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ReturnStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseReturnStatement(parser: Parser, context: Context): ESTree.ReturnStatement {
    if (!(context & (Context.OptionsGlobalReturn | Context.InFunctionBody))) report(parser, Errors.IllegalReturn);
    const pos = getLocation(parser);
    nextToken(parser, context);
    const argument = (parser.token & Token.ASI) !== Token.ASI && !(parser.flags & Flags.NewLine) ?
        parseExpression(parser, context  & ~Context.InFunctionBody) :
        null;
    consumeSemicolon(parser, context);
    return finishNode(parser, context, pos, {
        type: 'ReturnStatement',
        argument
    });
}

/**
 * Parses empty statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-EmptyStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseEmptyStatement(parser: Parser, context: Context): ESTree.EmptyStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    return finishNode(parser, context, pos, {
        type: 'EmptyStatement'
    });
}

/**
 * Parses try statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TryStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseTryStatement(parser: Parser, context: Context): ESTree.TryStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    const block = parseBlockStatement(parser, context);
    const handler = parser.token === Token.CatchKeyword ? parseCatchBlock(parser, context) : null;
    const finalizer = consume(parser, context, Token.FinallyKeyword) ? parseBlockStatement(parser, context) : null;
    if (!handler && !finalizer) report(parser, Errors.NoCatchOrFinally);
    return finishNode(parser, context, pos, {
        type: 'TryStatement',
        block,
        handler,
        finalizer
    });
}

/**
 * Parses catch block
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Catch)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseCatchBlock(parser: Parser, context: Context): any {
    const pos = getLocation(parser);
    nextToken(parser, context);
    let param: ESTree.PatternTop | null = null;
    if (consume(parser, context, Token.LeftParen)) {
        if (parser.token === Token.RightParen) {
            report(parser, Errors.NoCatchClause);
        } else {
            param = parseBindingIdentifierOrPattern(parser, context);
            if (parser.token === Token.Assign) report(parser, Errors.NoCatchClause);
        }
        expect(parser, context, Token.RightParen);
    }
    const body = parseBlockStatement(parser, context);

    return finishNode(parser, context, pos, {
        type: 'CatchClause',
        param,
        body
    });
}

/**
 * Parses throw statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ThrowStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseThrowStatement(parser: Parser, context: Context): ESTree.ThrowStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    if (parser.flags & Flags.NewLine) report(parser, Errors.NewlineAfterThrow);
    const argument: ESTree.Expression = parseExpression(parser, context);
    consumeSemicolon(parser, context);
    return finishNode(parser, context, pos, {
        type: 'ThrowStatement',
        argument
    });
}

/**
 * Parses either expression or labelled statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExpressionStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-LabelledStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseExpressionOrLabelledStatement(
    parser: Parser,
    context: Context,
    label: LabelledFunctionState
): ESTree.ExpressionStatement | ESTree.LabeledStatement {
    const { tokenValue, token  } = parser;
    const pos = getLocation(parser);
    const expr: ESTree.Expression = parseExpression(parser, context);
    if (token & (Token.Identifier | Token.Keyword) && parser.token === Token.Colon) {
        nextToken(parser, context);
        if (context & Context.Strict && parser.token === Token.AsyncKeyword) report(parser, Errors.Unexpected);
        if (getLabel(parser, tokenValue, false, true)) {
            report(parser, Errors.LabelRedeclaration, tokenValue);
        }
        addLabel(parser, tokenValue);
        let body: ESTree.Statement | ESTree.FunctionDeclaration | null = null;
        if (parser.token === Token.FunctionKeyword && !(context & Context.Strict) &&
            label === LabelledFunctionState.Allow) {
            body = parseFunctionDeclaration(parser, context);
        } else body = parseStatement(parser, context, label);
        parser.labelDepth--;
        return finishNode(parser, context, pos, {
            type: 'LabeledStatement',
            label: expr as ESTree.Identifier,
            body
        });
    }

    consumeSemicolon(parser, context);
    return finishNode(parser, context, pos, {
        type: 'ExpressionStatement',
        expression: expr
    });
}

/**
 * Parses either an lexical declaration (let) or an expression statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-let-and-const-declarations)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExpressionStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseLetOrExpressionStatement(
    parser: Parser,
    context: Context,
): any {
    return lookahead(parser, context, isLexical) ?
        parseVariableStatement(parser, context, BindingType.Let) :
        parseExpressionOrLabelledStatement(parser, context, LabelledFunctionState.Disallow);
}

/**
 * Parses variable statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseVariableStatement(
    parser: Parser,
    context: Context,
    type: BindingType,
    origin: BindingOrigin = BindingOrigin.Statement
): ESTree.VariableDeclaration {
    const pos = getLocation(parser);
    const { token } = parser;
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, type, origin);
    consumeSemicolon(parser, context);
    return finishNode(parser, context, pos, {
        type: 'VariableDeclaration',
        kind: tokenDesc(token) as 'var' | 'let' | 'const',
        declarations
    });
}

/**
 * Parses either For, ForIn or ForOf statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-statement)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements)
 *
 * @param parser  Parser object
 * @param context Context masks
 */

export function parseForStatement(parser: Parser, context: Context): any {
    const pos = getLocation(parser);
    nextToken(parser, context);
    const forAwait = (context & Context.Async) > 0 && consume(parser, context, Token.AwaitKeyword);
    expect(parser, context, Token.LeftParen);
    let init: any = null;
    let declarations: ESTree.VariableDeclarator[] | null = null;
    let type: 'ForStatement' | 'ForInStatement' | 'ForOfStatement' = 'ForStatement';
    let test: ESTree.Expression | null = null;
    let update: ESTree.Expression | null = null;
    let right;
    let bindingType: BindingType = BindingType.Empty;
    if (parser.token !== Token.Semicolon) {
        const token = parser.token;
        if (token === Token.VarKeyword) {
            bindingType = BindingType.Var;
        } else if (token === Token.ConstKeyword) {
            bindingType = BindingType.Const;
        } else if (token === Token.LetKeyword && lookahead(parser, context, isLexical)) {
            bindingType = BindingType.Let;
        } else init = parseAssignmentExpression(parser, context | Context.DisallowIn);

        if (bindingType & BindingType.Variable) {
            nextToken(parser, context);
            declarations = parseVariableDeclarationList(parser, context | Context.DisallowIn, bindingType, BindingOrigin.ForStatement);
            init = {
                type: 'VariableDeclaration',
                kind: tokenDesc(token) as 'var' | 'let' | 'const',
                declarations
            };
        }
    }

    if (forAwait ? expect(parser, context, Token.OfKeyword) : consume(parser, context, Token.OfKeyword)) {
        type = 'ForOfStatement';
        if (init) reinterpret(parser, context, init);
        else init = declarations;
        right = parseExpression(parser, context);
    } else if (consume(parser, context, Token.InKeyword)) {
        type = 'ForInStatement';
        if (init) reinterpret(parser, context, init);
        else init = declarations;
        right = parseAssignmentExpression(parser, context);
    } else {
        if (parser.token === Token.Comma) init = parseSequenceExpression(parser, context, init, pos);
        expect(parser, context, Token.Semicolon, Errors.InvalidLhsInFor);
        if (parser.token !== Token.Semicolon) {
            test = parseExpression(parser, context);
        }
        expect(parser, context, Token.Semicolon);
        if (parser.token !== Token.RightParen) update = parseExpression(parser, context);
    }

    expect(parser, context, Token.RightParen);

    const previousIterationStatement = parser.iterationStatement;
    parser.iterationStatement = LabelState.Iteration;
    const body = parseStatement(parser, context, LabelledFunctionState.Disallow);
    parser.iterationStatement = previousIterationStatement;

    return type === 'ForOfStatement' ? finishNode(parser, context, pos, {
            type,
            body,
            left: init,
            right,
            await: forAwait
        }) :
        right ? finishNode(parser, context, pos, {
            type: type as 'ForInStatement',
            body,
            left: init,
            right
        }) : finishNode(parser, context, pos, {
            type: type as 'ForStatement',
            body,
            init,
            test,
            update
        });
}
/**
 * Parses switch statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SwitchStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseSwitchStatement(parser: Parser, context: Context): ESTree.SwitchStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    expect(parser, context, Token.LeftParen);
    const discriminant = parseExpression(parser, context);
    context = (context | Context.TaggedTemplate) ^ Context.TaggedTemplate;
    expect(parser, context, Token.RightParen);
    expect(parser, context, Token.LeftBrace);
    const cases: ESTree.SwitchCase[] = [];
    let seenDefault = false;
    const previousSwitchStatement = parser.switchStatement;
    parser.switchStatement = LabelState.Iteration;
    while (parser.token !== Token.RightBrace) {
        const switchLoc = getLocation(parser);
        let test: ESTree.Expression | null = null;
        if (consume(parser, context, Token.CaseKeyword)) {
            test = parseExpression(parser, context);
        } else {
            expect(parser, context, Token.DefaultKeyword);
            if (seenDefault) report(parser, Errors.MultipleDefaultsInSwitch);
            seenDefault = true;
        }

        cases.push(parseCaseOrDefaultClauses(parser, context, test, switchLoc));
    }
    parser.switchStatement = previousSwitchStatement;
    expect(parser, context, Token.RightBrace);

    return finishNode(parser, context, pos, {
        type: 'SwitchStatement',
        discriminant,
        cases
    });
}

/**
 * Parses either default clause or case clauses
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-CaseClauses)
 * @see [Link](https://tc39.github.io/ecma262/#prod-DefaultClause)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseCaseOrDefaultClauses(
    parser: Parser,
    context: Context,
    test: ESTree.Expression | null,
    pos: Location
): ESTree.SwitchCase {
    expect(parser, context, Token.Colon);
    const consequent: ESTree.Statement[] = [];
    while (parser.token !== Token.CaseKeyword && parser.token !== Token.RightBrace && parser.token !== Token.DefaultKeyword) {
      consequent.push(parseStatementListItem(parser, context));
    }

    return finishNode(parser, context, pos, {
        type: 'SwitchCase',
        test,
        consequent
    });
}

/**
 * Parses the if statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-if-statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseIfStatement(parser: Parser, context: Context): ESTree.IfStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    expect(parser, context, Token.LeftParen);
    const test = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    const consequent = parseConsequentOrAlternate(parser, context);
    const alternate = consume(parser, context, Token.ElseKeyword) ? parseConsequentOrAlternate(parser, context) : null;
    return finishNode(parser, context, pos, {
        type: 'IfStatement',
        test,
        consequent,
        alternate
    });
}

/**
 * Parse either consequent or alternate. Supports AnnexB.
 * @param parser  Parser object
 * @param context Context masks
 */
function parseConsequentOrAlternate(parser: Parser, context: Context): ESTree.Statement | ESTree.FunctionDeclaration {
    return context & Context.Strict || parser.token !== Token.FunctionKeyword ?
        parseStatement(parser, context) :
        parseFunctionDeclaration(parser, context | Context.InIf);
}

/**
 * Parses do while statement
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseDoWhileStatement(parser: Parser, context: Context): ESTree.DoWhileStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    const previousIterationStatement = parser.iterationStatement;
    parser.iterationStatement = LabelState.Iteration;
    const body = parseStatement(parser, context, LabelledFunctionState.Disallow);
    parser.iterationStatement = previousIterationStatement;
    expect(parser, context, Token.WhileKeyword);
    expect(parser, context, Token.LeftParen);
    const test = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    consume(parser, context, Token.Semicolon);
    return finishNode(parser, context, pos, {
        type: 'DoWhileStatement',
        body,
        test
    });
}

/**
 * Parses while statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-grammar-notation-WhileStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseWhileStatement(parser: Parser, context: Context): ESTree.WhileStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    expect(parser, context, Token.LeftParen);
    const test = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    const previousIterationStatement = parser.iterationStatement;
    parser.iterationStatement = LabelState.Iteration;
    const body = parseStatement(parser, context, LabelledFunctionState.Disallow);
//    parser.iterationStatement = previousIterationStatement;

    return finishNode(parser, context, pos, {
        type: 'WhileStatement',
        test,
        body
    });
}

/**
 * Parses the continue statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ContinueStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseContinueStatement(parser: Parser, context: Context): ESTree.ContinueStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    let label: ESTree.Identifier | undefined | null = null;
    if (!(parser.flags & Flags.NewLine) && parser.token & (Token.Identifier | Token.Keyword)) {
        const { tokenValue  } = parser;
        label = parseIdentifier(parser, context);
        validateContinueLabel(parser, context, tokenValue);
    }
    consumeSemicolon(parser, context);

    if (label === null &&  parser.iterationStatement === LabelState.Empty && parser.switchStatement === LabelState.Empty) {
        report(parser, Errors.IllegalContinue);
    }
    return finishNode(parser, context, pos, {
        type: 'ContinueStatement',
        label
    });
}

/**
 * Parses the break statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BreakStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBreakStatement(parser: Parser, context: Context): ESTree.BreakStatement {
    const pos = getLocation(parser);
    nextToken(parser, context);
    let label: ESTree.Identifier | undefined | null = null;
    if (!(parser.flags & Flags.NewLine) && parser.token & (Token.Identifier | Token.Keyword)) {
        const { tokenValue  } = parser;
        label = parseIdentifier(parser, context);
        validateBreakStatement(parser, context, tokenValue);
    } else if (parser.iterationStatement === LabelState.Empty &&
        parser.switchStatement === LabelState.Empty) {
        report(parser, Errors.IllegalBreak);
    }
    consumeSemicolon(parser, context);
    return finishNode(parser, context, pos, {
        type: 'BreakStatement',
        label
    });
}

/**
 * Parses with statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-WithStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseWithStatement(parser: Parser, context: Context): ESTree.WithStatement {
    const pos = getLocation(parser);
    if (context & Context.Strict) report(parser, Errors.StrictModeWith);
    nextToken(parser, context);
    expect(parser, context, Token.LeftParen);
    const object = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    const body = parseStatement(parser, context, LabelledFunctionState.Disallow);
    return finishNode(parser, context, pos, {
        type: 'WithStatement',
        object,
        body
    });
}

/**
 * Parses either async function declaration or statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncFunctionDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAsyncFunctionDeclarationOrStatement(parser: Parser, context: Context): any {
    return lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, /* isLookaHead */ false) ?
        parseFunctionDeclaration(parser, context, ModifierState.Async) :
        parseStatement(parser, context);
}

/**
 * Parse directive
 *
 * * @see [Link](https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseDirective(parser: Parser, context: Context): ESTree.ExpressionStatement {
    const pos = getLocation(parser);
    const directive = parser.source.slice(parser.startIndex + 1, parser.index - 1);
    const expr = parseExpression(parser, context);
    consumeSemicolon(parser, context);
    return finishNode(parser, context, pos, {
      type: 'ExpressionStatement',
      expression: expr,
      directive
    });
  }
