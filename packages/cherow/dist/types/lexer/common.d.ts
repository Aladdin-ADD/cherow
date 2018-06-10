import { Parser } from '../types';
import { Token } from '../token';
import { Chars } from '../chars';
export declare const enum ClassRangesState {
    Empty = 0,
    IsTrailSurrogate = 1,
    IsSurrogateLead = 4,
    SeenUnicoderange = 256,
    InCharacterRange = 1024
}
export declare const enum RegexpState {
    InvalidClassEscape = 2,
    ValidClassEscape = 6,
    UnicodeMode = 16,
    SloppyMode = 32,
    OnlySloppy = 64,
    Valid = 96,
    Invalid = 128,
    InvalidCharClass = 1114112,
    InvalidCharClassRange = 1114113,
    InvalidCharClassInSloppy = 16777216,
    Quantifier = 33554432,
    MissingDigits = 67108864,
    EndOfRegex = 134217728
}
export declare const enum RegExpFlags {
    Empty = 0,
    Global = 1,
    IgnoreCase = 2,
    Multiline = 4,
    Unicode = 8,
    Sticky = 16,
    DotAll = 32,
    AllRegexFlags = 63
}
export declare const enum RegexState {
    Valid = 836,
    Invalid = 9284,
    OnlyUnicode = 6,
    NoStrict = 69420072,
    StrictMode = 78928,
    SloppyMode = 78930,
    InvalidClassEscape = 1114112,
    InvalidRange = 1114113,
    InvalidEscape = -1,
    ValidEscape = -2,
    InvalidSloppyClass = 16777216
}
export declare const enum RangeState {
    Empty = 0,
    Strict = 1,
    Sloppy = 2
}
export declare function consumeOpt(parser: Parser, code: number): boolean;
/**
* Consumes line feed
*
* @param parser Parser object
* @param state  Scanner state
*/
export declare function consumeLineFeed(parser: Parser, lastIsCR: boolean): void;
/**
* Advance to new line
*
* @param parser Parser object
*/
export declare function advanceNewline(parser: Parser, ch: number): void;
export declare function skipToNewline(parser: Parser): boolean;
export declare function readNext(parser: Parser, ch: any): number;
export declare function nextUnicodeChar(parser: Parser): number;
export declare function isDecimalDigit(code: number): boolean;
export declare function isSurrogateLead(code: number): boolean;
export declare function isSurrogateTail(code: number): boolean;
export declare function getSurrogate(hi: number, low: number): number;
export declare function toHex(code: number): number;
export declare function isHex(code: number): boolean;
export declare const fromCodePoint: (code: Chars) => string;
export declare function convertToken(parser: Parser, token: Token): any;
export declare function isAsciiLetter(codePoint: number): boolean;
export declare const hasBit: (mask: number, flags: number) => boolean;
export declare function validateQuantifierPrefix(parser: Parser): boolean | number;
export declare function isFlagStart(code: number): boolean;
export declare function isIdentRestChr(c: number): boolean;
/**
 * Returns true if valid unicode continue
 *
 * @param {number} code
 * @returns {boolean}
 */
export declare function isValidUnicodeidcontinue(code: number): boolean;
export declare function setValidationState(state: RegexpState, escapeStatus: RegexpState): RegexpState;
export declare function setRegExpState(parser: Parser, flagState: RegexpState, bodyState: RegexpState): RegexpState;
/**
 * Parse back reference index
 *
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape)
 *
 * @param parser Parser object
 * @param code Code point
 */
export declare function parseBackReferenceIndex(parser: Parser, code: number): RegexpState;
