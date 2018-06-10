import { nextToken } from './lexer/scan';
import { Token, tokenDesc } from './token';
import { Parser } from './types';
import * as ESTree from './estree';
import { Errors, recordErrors, } from './errors';
import { parseIdentifier } from './parser/expressions';

/* Context masks */
export const enum Context {

    Empty                = 0,
    OptionsJSX           = 1 << 0,
    OptionsRaw           = 1 << 1,
    OptionsNext          = 1 << 2,
    OptionsWebCompat     = 1 << 3,
    OptionsEditorMode    = 1 << 4,
    OptionsLoc           = 1 << 5,
    OptionsRanges        = 1 << 6,
    OptionsRawIdentifier = 1 << 7,
    OptionsGlobalReturn  = 1 << 8,
    OptionsComments      = 1 << 9,
    OptionsShebang       = 1 << 10,
    OptionsExperimental  = 1 << 11,
    OptionsRawidentifiers = 1 << 12,
    OptionsNode           = 1 << 13,
    Strict               = 1 << 14,
    Module               = 1 << 15,
    RequireIdentifier    = 1 << 16,
    InFunctionBody       = 1 << 17,
    Async                = 1 << 18,
    DisallowIn           = 1 << 19,
    InParameter          = 1 << 20,
    Method               = 1 << 21,
    InParen              = 1 << 22,
    Yield                = 1 << 23,
    NewTarget            = 1 << 24,
    TaggedTemplate       = 1 << 25,
    Statement            = 1 << 26,
    Asi                  = 1 << 27,
    AllowSuperProperty   = 1 << 28,
}

/* Mutual parser flags */
export const enum Flags {
    Empty                = 0,
    NewLine              = 1 << 0,
    HasOctal             = 1 << 1,
    Assignable           = 1 << 2,
    Bindable             = 1 << 3,
    SimpleParameterList  = 1 << 4,
    HasConstructor       = 1 << 5,
    StrictEvalArguments  = 1 << 6,
    StrictReserved       = 1 << 7
}

/* Binding origin */
export const enum BindingOrigin {
    Empty           = 0,
    ForStatement    = 1 << 0,
    FunctionArgs    = 1 << 1,
    CatchClause     = 1 << 2,
    Export          = 1 << 3,
    Import          = 1 << 4,
    Statement       = 1 << 5,

}

/* Binding state */
export const enum BindingType {
    Empty       = 0,
    Args        = 1 << 0,
    Var         = 1 << 1,
    Let         = 1 << 2,
    Const       = 1 << 3,
    Class       = 1 << 4,
    Variable    = Var | Let | Const
}

/* Binding kind */
export const enum BindingKind {
    Class,
    Var,
    Let,
    Const
}

/* Recovery state */
export const enum Recovery {
    Empty         = 0,
    Unterminated  = 1 << 0,
}

/* Tokenizer state */
export const enum Tokenize {
    Empty,
    NoWhiteSpace,
    All
}

export const enum ModifierState {
    None         = 0,
    Generator    = 1 << 0,
    Await        = 1 << 1,
    Arrow        = 1 << 2,
    Async        = 1 << 3,
    Heritage     = 1 << 4,
    Constructor  = 1 << 5,
    Method       = 1 << 6,
    Shorthand    = 1 << 7,
    Getter       = 1 << 8,
    Setter       = 1 << 9,
    Static       = 1 << 10,
}

/*@internal*/
export const enum LabelState {
    Empty            = 0,      // Break statement
    Iteration        = 1 << 0, // Parsing iteration statement
    CrossingBoundary = 1 << 1, // Crossing function boundary
}

export function setGrammar(flags: Flags, mask: Flags): Context {
    return (flags | mask) ^ mask;
}

export function swapFlags(flags: Flags, mask: Flags): Flags {
    return (flags | mask) ^ mask;
}

export function setContext(context: Context, mask: Context): Context {
    return (context | mask) ^ mask;
}

export function swapContext(context: Context, state: ModifierState): Context {
    context = setContext(context, Context.Yield);
    context = setContext(context, Context.Async);
    context = setContext(context, Context.InParameter);
    if (state & ModifierState.Generator) context = context | Context.Yield;
    if (state & ModifierState.Async) context = context | Context.Async;
    // `new.target` disallowed for arrows in global scope
    if (!(state & ModifierState.Arrow)) context = context | Context.NewTarget;
    return context;
}

export function expect(parser: Parser, context: Context, token: Token, errMsg = Errors.UnexpectedToken): boolean {
    if (parser.token !== token) {
        recordErrors(parser, context, errMsg, tokenDesc(parser.token));
        return false;
    }
    nextToken(parser, context);
    return true;
  }

export function consume(parser: Parser, context: Context, token: Token): boolean {
    if (parser.token !== token) return false;
    nextToken(parser, context);
    return true;
}

/**
 * Automatic Semicolon Insertion
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function consumeSemicolon(parser: Parser, context: Context): void | boolean {
    return (parser.token & Token.ASI) === Token.ASI || parser.flags & Flags.NewLine
      ? consume(parser, context, Token.Semicolon)
      : recordErrors(parser, context, Errors.Unexpected);
  }

 /**
  * Does a lookahead
  *
  * @param parser Parser object
  * @param context  Context masks
  * @param callback Callback function to be invoked
  * @param isLookahead  If set to false, the parser will not rewind
  */
export function lookahead<T>(
     parser: Parser,
     context: Context,
     callback: (parser: Parser, context: Context) => T,
     isLookahead: boolean = true): T {
    const {
        tokenValue,
        flags,
        line,
        column,
        index,
        startIndex,
        tokenRaw,
        token,
        tokenRegExp,
      } = parser;
    const result = callback(parser, context);
    if (!result || isLookahead) {
      parser.index = index;
      parser.token = token;
      parser.tokenValue = tokenValue;
      parser.tokenValue = tokenValue;
      parser.flags = flags;
      parser.line = line;
      parser.column = column;
      parser.tokenRaw = tokenRaw;
      parser.startIndex = startIndex;
      parser.tokenRegExp = tokenRegExp;
      parser.tokenRegExp = tokenRegExp;
    }
    return result;
}
/**
 * Validates if the next token in the stream is a function keyword on the same line.
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export function nextTokenIsFuncKeywordOnSameLine(parser: Parser, context: Context): boolean {
    nextToken(parser, context);
    return !(parser.flags & Flags.NewLine) && parser.token === Token.FunctionKeyword;
  }

  /**
 * Validates if the next token in the stream is a left paren or a period
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export function nextTokenIsLeftParenOrPeriod(parser: Parser, context: Context): boolean {
    nextToken(parser, context);
    return parser.token === Token.LeftParen || parser.token === Token.Period;
  }

  /**
 * Validates if the next token in the stream is left parenthesis.
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export function nextTokenIsLeftParenOrKeyword(parser: Parser, context: Context): boolean {
    nextToken(parser, context);

    return (parser.token & Token.Identifier) === Token.Identifier ||
            parser.token === Token.Keyword ||
            parser.token === Token.LeftParen;
  }

export function nextTokenIsLeftParen(parser: Parser, context: Context): boolean {
    nextToken(parser, context);
    return parser.token === Token.LeftParen;
  }

export function nextTokenIsPeriod(parser: Parser, context: Context): boolean {
    nextToken(parser, context);
    return parser.token === Token.Period;
  }

/**
 * Validates if the next token in the stream is arrow
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export function nextTokenIsArrow(parser: Parser, context: Context): boolean {
    nextToken(parser, context);
    return parser.token === Token.Arrow;
  }

  /**
 * Returns true if this an valid lexical binding and not an identifier
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export function isLexical(parser: Parser, context: Context): boolean {
    nextToken(parser, context);
    const { token } = parser;
    return (token & Token.Identifier) === Token.Identifier ||
    token === Token.LeftBracket ||
    token === Token.LeftBrace ||
    token === Token.LetKeyword ||
    token === Token.YieldKeyword;
}

export function isInOrOf(parser: Parser): boolean {
    return parser.token === Token.InKeyword || parser.token === Token.OfKeyword;
}
export function isBinding(parser: Parser): boolean {
    return  parser.token === Token.LeftBrace || parser.token === Token.LeftBracket;
}

/**
 * Reinterpret various expressions as pattern
 * This is only used for assignment and arrow parameter list
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param node AST node
 */
export function reinterpret(parser: Parser, context: Context, node: any): void {
    switch (node.type) {
        case 'ArrayExpression':
            node.type = 'ArrayPattern';
            for (let i = 0; i < node.elements.length; ++i) {
                // skip holes in pattern
                if (node.elements[i] !== null) {
                    reinterpret(parser, context, node.elements[i]);
                }
            }
            return;

        case 'ObjectExpression':
            node.type = 'ObjectPattern';
            for (let i = 0; i < node.properties.length; i++) {
                reinterpret(parser, context, node.properties[i].value);
            }
            return;
        case 'AssignmentExpression':
            node.type = 'AssignmentPattern';
          //  if (node.operator !== '=') recordErrors(parser, context, Errors.InvalidLHSDefaultValue);
            delete node.operator;
            return;
        default: // ignore
    }
}

/**
 * Returns true if start of an iteration statement
 *
 * @param parser Parser object
 */
function isIterationStatement(parser: Parser): boolean {
    return parser.token === Token.WhileKeyword || parser.token === Token.DoKeyword || parser.token === Token.ForKeyword;
}

/**
 * Add label to the stack
 *
 * @param parser Parser object
 * @param label Label to be added
 */
export function addLabel(parser: Parser, label: string): void {
    if (parser.labelSet === undefined) parser.labelSet = {};
    parser.labelSet[label] = true;
    parser.labelSetStack[parser.labelDepth] = parser.labelSet;
    parser.iterationStack[parser.labelDepth] = isIterationStatement(parser);
    parser.labelSet = undefined;
    parser.labelDepth++;
}

/**
 * Add function
 *
 * @param parser Parser object
 * @param label Label to be added
 */
export function addCrossingBoundary(parser: Parser): void {
    parser.labelSetStack[parser.labelDepth] = parser.functionBoundaryStack;
    parser.iterationStack[parser.labelDepth] = LabelState.Empty;
    parser.labelDepth++;
}

/**
 * Validates continue statement
 *
 * @param parser Parser object
 * @param label Label
 */
export function validateContinueLabel(parser: Parser, context: Context, label: string): void {
    const state = getLabel(parser, label, true);
    if ((state & LabelState.Iteration) !== LabelState.Iteration) {
        if (state & LabelState.CrossingBoundary) {
            recordErrors(parser, context, Errors.InvalidNestedStatement);
        } else {
            recordErrors(parser, context, Errors.UnknownLabel, label as string);
        }
    }
}

/**
 * Validates break statement
 *
 * @param parser Parser object
 * @param label Label
 */
export function validateBreakStatement(parser: Parser, context: Context, label: any): void {
    const state = getLabel(parser, label);
    if ((state & LabelState.Iteration) !== LabelState.Iteration) recordErrors(parser, context, Errors.UnknownLabel, label);
}

/**
 * Add label
 *
 * @param parser Parser object
 * @param label Label to be added
 */
export function getLabel(
    parser: Parser,
    label: string,
    iterationStatement: boolean = false,
    crossBoundary: boolean = false
): LabelState {
    if (!iterationStatement && parser.labelSet && parser.labelSet[label] === true) {
        return LabelState.Iteration;
    }

    if (!parser.labelSetStack) return LabelState.Empty;

    let stopAtTheBorder = false;
    for (let i = parser.labelDepth - 1; i >= 0; i--) {
        const labelSet = parser.labelSetStack[i];
        if (labelSet === parser.functionBoundaryStack) {
            if (crossBoundary) {
                break;
            } else {
                stopAtTheBorder = true;
                continue;
            }
        }

        if (iterationStatement && parser.iterationStack[i] === false) {
            continue;
        }

        if (labelSet[label] === true) {
            return stopAtTheBorder ? LabelState.CrossingBoundary : LabelState.Iteration;
        }
    }

    return LabelState.Empty;
}

export function isStartOfExpression(parser: Parser): boolean {
    switch (parser.token) {
        case Token.Identifier:
        case Token.NumericLiteral:
        case Token.StringLiteral:
        case Token.RegularExpression:
        case Token.FalseKeyword:
        case Token.TrueKeyword:
        case Token.NullKeyword:
        case Token.Template:
        case Token.LeftParen:
        case Token.LeftBrace:
        case Token.LeftBracket:
        case Token.DivideAssign:
        case Token.Divide:
        case Token.LessThan:
        case Token.VarKeyword:
        case Token.LetKeyword:
        case Token.ConstKeyword:
        case Token.FunctionKeyword:
        case Token.IfKeyword:
        case Token.ImportKeyword:
        case Token.SuperKeyword:
        case Token.SwitchKeyword:
        case Token.ThisKeyword:
        case Token.ThrowKeyword:
        case Token.YieldKeyword:
        case Token.AwaitKeyword:
        case Token.Eval:
        case Token.Arguments:
        case Token.BigInt:
        case Token.SuperKeyword:
            return true;
        default:
            return false;
    }
}

/**
 * Parse identifier name
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-IdentifierName)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param t token
 */

export function parseIdentifierName(parser: Parser, context: Context, t: Token): ESTree.Identifier {
    if (!(t & (Token.Identifier | Token.Keyword))) {
        recordErrors(parser, context, Errors.UnexpectedKeyword, tokenDesc(t));
    }
    return parseIdentifier(parser, context);
}
