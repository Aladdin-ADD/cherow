import { Token } from './token';
import { Parser } from './types';
import * as ESTree from './estree';
import { Errors } from './errors';
export declare const enum Context {
    Empty = 0,
    OptionsTokenize = 1,
    OptionsJSX = 2,
    OptionsRaw = 4,
    OptionsNext = 8,
    OptionsWebCompat = 16,
    OptionsEditorMode = 32,
    OptionsLoc = 64,
    OptionsRanges = 128,
    OptionsRawIdentifier = 256,
    OptionsGlobalReturn = 512,
    OptionsComments = 1024,
    OptionsShebang = 2048,
    OptionsExperimental = 4096,
    OptionsRawidentifiers = 8192,
    OptionsNode = 16384,
    Strict = 32768,
    Module = 65536,
    RequireIdentifier = 131072,
    InFunctionBody = 262144,
    Async = 524288,
    DisallowIn = 1048576,
    InParameter = 2097152,
    Method = 4194304,
    InParen = 8388608,
    Yield = 16777216,
    NewTarget = 33554432,
    TaggedTemplate = 67108864,
    Statement = 134217728,
    Asi = 268435456,
    AllowSuperProperty = 536870912
}
export declare const enum Flags {
    Empty = 0,
    NewLine = 1,
    HasOctal = 2,
    Assignable = 4,
    Bindable = 8,
    SimpleParameterList = 16,
    HasConstructor = 32,
    StrictEvalArguments = 64,
    StrictReserved = 128
}
export declare const enum BindingOrigin {
    Empty = 0,
    ForStatement = 1,
    FunctionArgs = 2,
    CatchClause = 4,
    Export = 8,
    Import = 16,
    Statement = 32
}
export declare const enum BindingType {
    Empty = 0,
    Args = 1,
    Var = 2,
    Let = 4,
    Const = 8,
    Class = 16,
    Variable = 14
}
export declare const enum BindingKind {
    Class = 0,
    Var = 1,
    Let = 2,
    Const = 3
}
export declare const enum Recovery {
    Empty = 0,
    Unterminated = 1
}
export declare const enum Tokenize {
    Empty = 0,
    NoWhiteSpace = 1,
    All = 2
}
export declare const enum ModifierState {
    None = 0,
    Generator = 1,
    Await = 2,
    Arrow = 4,
    Async = 8,
    Heritage = 16,
    Constructor = 32,
    Method = 64,
    Shorthand = 128,
    Getter = 256,
    Setter = 512,
    Static = 1024
}
export declare function setGrammar(flags: Flags, mask: Flags): Context;
export declare function swapFlags(flags: Flags, mask: Flags): Flags;
export declare function setContext(context: Context, mask: Context): Context;
export declare function swapContext(context: Context, state: ModifierState): Context;
export declare function expect(parser: Parser, context: Context, token: Token, errMsg?: Errors): boolean;
export declare function consume(parser: Parser, context: Context, token: Token): boolean;
/**
 * Automatic Semicolon Insertion
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function consumeSemicolon(parser: Parser, context: Context): void | boolean;
/**
 * Does a lookahead
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param callback Callback function to be invoked
 * @param isLookahead  If set to false, the parser will not rewind
 */
export declare function lookahead<T>(parser: Parser, context: Context, callback: (parser: Parser, context: Context) => T, isLookahead?: boolean): T;
/**
 * Validates if the next token in the stream is a function keyword on the same line.
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export declare function nextTokenIsFuncKeywordOnSameLine(parser: Parser, context: Context): boolean;
/**
* Validates if the next token in the stream is a left paren or a period
*
* @param parser Parser object
* @param context  Context masks
*/
export declare function nextTokenIsLeftParenOrPeriod(parser: Parser, context: Context): boolean;
/**
* Validates if the next token in the stream is left parenthesis.
*
* @param parser Parser object
* @param context  Context masks
*/
export declare function nextTokenIsLeftParenOrKeyword(parser: Parser, context: Context): boolean;
export declare function nextTokenIsLeftParen(parser: Parser, context: Context): boolean;
export declare function nextTokenIsPeriod(parser: Parser, context: Context): boolean;
/**
 * Validates if the next token in the stream is arrow
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export declare function nextTokenIsArrow(parser: Parser, context: Context): boolean;
/**
* Returns true if this an valid lexical binding and not an identifier
*
* @param parser Parser object
* @param context  Context masks
*/
export declare function isLexical(parser: Parser, context: Context): boolean;
export declare function isInOrOf(parser: Parser): boolean;
export declare function isBinding(parser: Parser): boolean;
/**
 * Reinterpret various expressions as pattern
 * This is only used for assignment and arrow parameter list
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param node AST node
 */
export declare function reinterpret(parser: Parser, context: Context, node: any): void;
/**
 * Add label to the stack
 *
 * @param parser Parser object
 * @param label Label to be added
 */
export declare function addLabel(parser: Parser, label: string): void;
/**
 * Add function
 *
 * @param parser Parser object
 * @param label Label to be added
 */
export declare function addCrossingBoundary(parser: Parser): void;
/**
 * Validates continue statement
 *
 * @param parser Parser object
 * @param label Label
 */
export declare function validateContinueLabel(parser: Parser, context: Context, label: string): void;
/**
 * Validates break statement
 *
 * @param parser Parser object
 * @param label Label
 */
export declare function validateBreakStatement(parser: Parser, context: Context, label: any): void;
/**
 * Add label
 *
 * @param parser Parser object
 * @param label Label to be added
 */
export declare function getLabel(parser: Parser, label: string, iterationStatement?: boolean, crossBoundary?: boolean): LabelState;
export declare function isStartOfExpression(parser: Parser): boolean;
/**
 * Parse identifier name
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-IdentifierName)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param t token
 */
export declare function parseIdentifierName(parser: Parser, context: Context, t: Token): ESTree.Identifier;
