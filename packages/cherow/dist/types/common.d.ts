import { Token } from './token';
import { Parser } from './types';
export declare const enum Context {
    Empty = 0,
    OptionsTokenize = 1,
    OptionsJSX = 2,
    OptionsRaw = 4,
    OptionsNext = 8,
    Strict = 16,
    Module = 32,
    Async = 64,
    Yield = 128,
    InParameter = 256,
    NewTarget = 512,
    Template = 1024,
    In = 2048,
    Statement = 4096,
    Asi = 8192,
}
export declare const enum Flags {
    Empty = 0,
    NewLine = 1,
    HasOctal = 2,
    IsAssignable = 4,
    IsBindable = 8,
    SimpleParameterList = 16,
}
export declare const enum BindingOrigin {
    Empty = 0,
    ForStatement = 1,
    FunctionArgs = 2,
    CatchClause = 4,
    Export = 8,
    Import = 16,
    Statement = 32,
}
/** Binding state */
export declare const enum BindingType {
    Empty = 0,
    Args = 1,
    Var = 2,
    Let = 4,
    Const = 8,
    Class = 16,
    Variable = 14,
}
export declare const enum Recovery {
    Empty = 0,
    Unterminated = 1,
}
export declare const enum Tokenize {
    Empty = 0,
    NoWhiteSpace = 1,
    All = 2,
}
export declare const enum ModifierState {
    None = 0,
    Generator = 1,
    Await = 2,
    Arrow = 4,
    Async = 4,
}
export declare function setContext(context: Context, mask: Context): Context;
export declare function swapContext(context: Context, state: ModifierState): Context;
export declare function nextToken(parser: Parser, context: Context): Token;
export declare function expect(parser: Parser, context: Context, token: Token): boolean;
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
 * Does a lookahead.
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param callback Callback function to be invoked
 */
export declare function lookahead<T>(parser: Parser, context: Context, callback: (parser: Parser, context: Context) => T): T;
/**
* Validates if the next token in the stream is left parenthesis.
*
* @param parser Parser object
* @param context  Context masks
*/
export declare function nextTokenIsLeftParen(parser: Parser, context: Context): boolean;
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