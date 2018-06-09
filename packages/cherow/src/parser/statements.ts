import { VariableDeclarator } from './../estree';
import { Parser } from '../types';
import { Token, tokenDesc } from '../token';
import * as ESTree from '../estree';
import { parseIdentifier, parseSequenceExpression, parseExpression, parseAssignmentExpression } from './expressions';
import { Errors, recordErrors, } from '../errors';
import { parseFunctionDeclaration, parseVariableDeclarationList, parseClassDeclaration } from './declarations';
import { parseDelimitedBindingList, parseBindingIdentifierOrPattern } from './pattern';
import {
    Context,
    Flags,
    nextToken,
    expect,
    consume,
    consumeSemicolon,
    BindingType,
    BindingOrigin,
    lookahead,
    setContext,
    isLexical,
    reinterpret,
    swapContext,
    nextTokenIsFuncKeywordOnSameLine,
    ModifierState,
    getLabel,
    addLabel,
    LabelState,
    validateContinueLabel,
    validateBreakStatement
} from '../common';

export const enum LabelledFunctionState {
    Allow,
    Disallow,
}

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
    while (parser.token !== Token.EndOfSource) {
        if ((parser.token & Token.StringLiteral) === Token.StringLiteral) {
            if (!(context & Context.Strict) && parser.tokenRaw.length === 12 && parser.tokenValue === 'use strict') {
                context |= Context.Strict;
            }
            statements.push(parseDirective(parser, context));
        } else {
            statements.push(parseStatementListItem(parser, context));
        }
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
                recordErrors(parser, context, Errors.AsyncFunctionInSingleStatementContext);
            }
            return parseExpressionOrLabelledStatement(parser, context, label);
        case Token.FunctionKeyword:
            // A function declaration has to be parsed out for 'editor mode'
            if (context & Context.OptionsEditorMode) return parseFunctionDeclaration(parser, context | Context.RequireIdentifier);
            recordErrors(parser, context, context & Context.Strict ? Errors.StrictFunction : Errors.SloppyFunction);
        case Token.ClassKeyword:
            recordErrors(parser, context, Errors.Unexpected);
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
    expect(parser, context, Token.DebuggerKeyword);
    consumeSemicolon(parser, context);
    return {
        type: 'DebuggerStatement'
    };
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
    const body: ESTree.Statement[] = [];
    expect(parser, context, Token.LeftBrace);
    while (parser.token !== Token.RightBrace) {
        body.push(parseStatementListItem(parser, context));
    }
    expect(parser, context, Token.RightBrace);

    return {
        type: 'BlockStatement',
        body
    };
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
    if (!(context & (Context.OptionsGlobalReturn | Context.InFunctionBody))) {
        recordErrors(parser, context, Errors.IllegalReturn);
      }
    expect(parser, context, Token.ReturnKeyword);
    const argument = (parser.token & Token.ASI) !== Token.ASI && !(parser.flags & Flags.NewLine) ?
        parseExpression(parser, context  & ~Context.InFunctionBody) :
        null;
    consumeSemicolon(parser, context);
    return {
        type: 'ReturnStatement',
        argument
    };
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
    nextToken(parser, context);
    return {
        type: 'EmptyStatement'
    };
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
    expect(parser, context, Token.TryKeyword);
    const block = parseBlockStatement(parser, context);
    const handler = parser.token === Token.CatchKeyword ? parseCatchBlock(parser, context) : null;
    const finalizer = consume(parser, context, Token.FinallyKeyword) ? parseBlockStatement(parser, context) : null;
    if (!handler && !finalizer) recordErrors(parser, context, Errors.NoCatchOrFinally);
    return {
        type: 'TryStatement',
        block,
        handler,
        finalizer
    };
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
    expect(parser, context, Token.CatchKeyword);
    let param: ESTree.PatternTop | null = null;
    if (consume(parser, context, Token.LeftParen)) {
        if (parser.token === Token.RightParen) {
            recordErrors(parser, context, Errors.NoCatchClause);
        } else {
            param = parseBindingIdentifierOrPattern(parser, context);
            if (parser.token === Token.Assign) recordErrors(parser, context, Errors.NoCatchClause);
        }
        expect(parser, context, Token.RightParen);
    }
    const body = parseBlockStatement(parser, context);

    return {
        type: 'CatchClause',
        param,
        body
    };
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
    expect(parser, context, Token.ThrowKeyword);
    if (parser.flags & Flags.NewLine) recordErrors(parser, context, Errors.NewlineAfterThrow);
    const argument: ESTree.Expression = parseExpression(parser, context);
    consumeSemicolon(parser, context);
    return {
        type: 'ThrowStatement',
        argument
    };
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
    const expr: ESTree.Expression = parseExpression(parser, context);
    if (token & (Token.Identifier | Token.Keyword) && parser.token === Token.Colon) {
        expect(parser, context, Token.Colon);
        if (getLabel(parser, tokenValue, false, true)) {
            recordErrors(parser, context, Errors.LabelRedeclaration, tokenValue);
        }
        addLabel(parser, tokenValue);
        let body: ESTree.Statement | ESTree.FunctionDeclaration | null = null;
        if (parser.token === Token.FunctionKeyword && !(context & Context.Strict) &&
            label === LabelledFunctionState.Allow) {
            body = parseFunctionDeclaration(parser, context);
        } else body = parseStatement(parser, context, LabelledFunctionState.Allow);
        parser.labelDepth--;
        return {
            type: 'LabeledStatement',
            label: expr as ESTree.Identifier,
            body
        };
    }

    consumeSemicolon(parser, context);
    return {
        type: 'ExpressionStatement',
        expression: expr
    };
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
    const { token } = parser;
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, type, origin);
    consumeSemicolon(parser, context);
    return {
        type: 'VariableDeclaration',
        kind: tokenDesc(token) as 'var' | 'let' | 'const',
        declarations
    };
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
    expect(parser, context, Token.ForKeyword);
    const forAwait = context & Context.Async && consume(parser, context, Token.AwaitKeyword);
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
        if (parser.token === Token.Comma) init = parseSequenceExpression(parser, context, init);
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

    return type === 'ForOfStatement' ? {
            type,
            body,
            left: init,
            right,
            await: forAwait
        } :
        right ? {
            type: type as 'ForInStatement',
            body,
            left: init,
            right
        } : {
            type: type as 'ForStatement',
            body,
            init,
            test,
            update
        };
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
    expect(parser, context, Token.SwitchKeyword);
    expect(parser, context, Token.LeftParen);
    const discriminant = parseExpression(parser, context);
    context = setContext(context, Context.TaggedTemplate);
    expect(parser, context, Token.RightParen);
    expect(parser, context, Token.LeftBrace);
    const cases: ESTree.SwitchCase[] = [];
    let seenDefault = false;
    const previousSwitchStatement = parser.switchStatement;
    parser.switchStatement = LabelState.Iteration;
    while (parser.token !== Token.RightBrace) {
        let test: ESTree.Expression | null = null;
        if (consume(parser, context, Token.CaseKeyword)) {
            test = parseExpression(parser, context);
        } else {
            expect(parser, context, Token.DefaultKeyword);
            if (seenDefault) recordErrors(parser, context, Errors.Unexpected);
            seenDefault = true;
        }
        cases.push(parseCaseOrDefaultClauses(parser, context, test));
    }
    parser.switchStatement = previousSwitchStatement;
    expect(parser, context, Token.RightBrace);

    return {
        type: 'SwitchStatement',
        discriminant,
        cases
    };
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
    test: ESTree.Expression | null
): ESTree.SwitchCase {
    expect(parser, context, Token.Colon);
    const consequent: ESTree.Statement[] = [];
    while (parser.token !== Token.CaseKeyword && parser.token !== Token.RightBrace && parser.tokenValue !== 'default') {
        consequent.push(parseStatementListItem(parser, context));
    }
    return {
        type: 'SwitchCase',
        test,
        consequent
    };
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
    expect(parser, context, Token.IfKeyword);
    expect(parser, context, Token.LeftParen);
    const test = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    const consequent = parseConsequentOrAlternate(parser, context);
    const alternate = consume(parser, context, Token.ElseKeyword) ? parseConsequentOrAlternate(parser, context) : null;
    return {
        type: 'IfStatement',
        test,
        consequent,
        alternate
    };
}

/**
 * Parse either consequent or alternate. Supports AnnexB.
 * @param parser  Parser object
 * @param context Context masks
 */
function parseConsequentOrAlternate(parser: Parser, context: Context): ESTree.Statement | ESTree.FunctionDeclaration {
    return context & Context.Strict || parser.token !== Token.FunctionKeyword ?
        parseStatement(parser, context) :
        parseFunctionDeclaration(parser, context);
}

/**
 * Parses do while statement
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseDoWhileStatement(parser: Parser, context: Context): ESTree.DoWhileStatement {
    expect(parser, context, Token.DoKeyword);
    const previousIterationStatement = parser.iterationStatement;
    parser.iterationStatement = LabelState.Iteration;
    const body = parseStatement(parser, context, LabelledFunctionState.Disallow);
    parser.iterationStatement = previousIterationStatement;
    expect(parser, context, Token.WhileKeyword);
    expect(parser, context, Token.LeftParen);
    const test = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    consume(parser, context, Token.Semicolon);
    return {
        type: 'DoWhileStatement',
        body,
        test
    };
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
    expect(parser, context, Token.WhileKeyword);
    expect(parser, context, Token.LeftParen);
    const test = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    const previousIterationStatement = parser.iterationStatement;
    parser.iterationStatement = LabelState.Iteration;
    const body = parseStatement(parser, context, LabelledFunctionState.Disallow);
    parser.iterationStatement = previousIterationStatement;

    return {
        type: 'WhileStatement',
        test,
        body
    };
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
    expect(parser, context, Token.ContinueKeyword);
    let label: ESTree.Identifier | undefined | null = null;
    if (!(parser.flags & Flags.NewLine) && parser.token & (Token.Identifier | Token.Keyword)) {
        const { tokenValue  } = parser;
        label = parseIdentifier(parser, context);
        validateContinueLabel(parser, context, tokenValue);
    }
    consumeSemicolon(parser, context);
    if (label === null && (parser.iterationStatement & LabelState.Empty) !== LabelState.Empty) {
        recordErrors(parser, context, Errors.IllegalContinue);
    }
    return {
        type: 'ContinueStatement',
        label
    };
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
    expect(parser, context, Token.BreakKeyword);
    let label: ESTree.Identifier | undefined | null = null;
    if (!(parser.flags & Flags.NewLine) && parser.token & (Token.Identifier | Token.Keyword)) {
        const { tokenValue  } = parser;
        label = parseIdentifier(parser, context);
        validateBreakStatement(parser, context, tokenValue);
    } else if ((parser.iterationStatement & LabelState.Empty) !== LabelState.Empty &&
        (parser.switchStatement & LabelState.Empty) !== LabelState.Empty) {
        recordErrors(parser, context, Errors.IllegalBreak);
    }
    consumeSemicolon(parser, context);
    return {
        type: 'BreakStatement',
        label
    };
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
    if (context & Context.Strict) recordErrors(parser, context, Errors.StrictModeWith);
    expect(parser, context, Token.WithKeyword);
    expect(parser, context, Token.LeftParen);
    const object = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    const body = parseStatement(parser, context);
    return {
        type: 'WithStatement',
        object,
        body
    };
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
function parseAsyncFunctionDeclarationOrStatement(
    parser: Parser,
    context: Context
): any {
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
export function parseDirective(parser: Parser, context: Context): any {
    const directive = parser.tokenRaw.slice(1, -1);
    const expr = parseExpression(parser, context);
    consumeSemicolon(parser, context);
    return {
      type: 'ExpressionStatement',
      expression: expr,
      directive
    };
  }