import { Identifier } from './../estree';
import { Parser } from '../types';
import { Token, tokenDesc } from '../token';
import { Context, Flags } from '../common';
import { Chars } from '../chars';
import { Errors, recordErrors } from '../errors';
import { isValidIdentifierPart } from '../unicode';

export const enum RegexpState {
    InvalidClassEscape = 0x2,
    ValidClassEscape = 0x6,
    UnicodeMode = 0x10,
    MaybeBothModes = 0x20,
    Valid = 0x60,
    Invalid = 0x80,
    InvalidCharClass = 0x110000,
    InvalidCharClassRange = 0x110001,
    InvalidCharClassInSloppy = 1 << 24,
    Quantifier = 1 << 25,
    EOF = 1 << 25,
    
}

export const enum RegExpFlags {
    Empty = 0,
        Global = 1 << 0,
        IgnoreCase = 1 << 1,
        Multiline = 1 << 2,
        Unicode = 1 << 3,
        Sticky = 1 << 4,
        DotAll = 1 << 5,
        AllRegexFlags  = (1 << 6) - 1
}

export const enum RegexState {
    Valid = 0x344,
    Invalid = 0x2444,
    OnlyUnicode = 0x6,
    NoStrict = 0x4234428, // GOOD_SANS_U_FLAG
    StrictMode = 0x13450,
    SloppyMode = 0x13452,

    InvalidClassEscape = 0x110000,
    InvalidRange = 0x110001,

    InvalidEscape = -1,
    ValidEscape = -2,

    InvalidSloppyClass = 1 << 24
}

export const enum RangeState {
    Empty,
    Strict = 1 << 0,
    Sloppy = 1 << 1,
}

export function consumeOpt(parser: Parser, code: number): boolean {
  if (parser.source.charCodeAt(parser.index) !== code) return false;
  parser.index++;
  parser.column++;
  return true;
}

/**
* Consumes line feed
*
* @param parser Parser object
* @param state  Scanner state
*/
export function consumeLineFeed(parser: Parser, lastIsCR: boolean): void {
  parser.flags |= Flags.NewLine;
  parser.index++;
  if (!lastIsCR) {
      parser.column = 0;
      parser.line++;
  }
}

/**
* Advance to new line
*
* @param parser Parser object
*/
export function advanceNewline(parser: Parser, ch: number) {
  parser.index++;
  parser.column = 0;
  parser.line++;
  if (parser.index < parser.length && ch === Chars.CarriageReturn &&
      parser.source.charCodeAt(parser.index) === Chars.LineFeed) {
      parser.index++;
  }
}

export function skipToNewline(parser: Parser): boolean {
  while (parser.index < parser.length) {
      const ch = parser.source.charCodeAt(parser.index);
      switch (ch) {
          case Chars.CarriageReturn:
          case Chars.LineFeed:
          case Chars.LineSeparator:
          case Chars.ParagraphSeparator:
              advanceNewline(parser, ch);
              return true;
          default:
              parser.index++;
              parser.column++;
      }
  }

  return false;
}

export function readNext(parser: Parser, ch: any): number {
    parser.index++; parser.column++;
    if (ch > 0xffff) parser.index++;
    if (parser.index >= parser.length) recordErrors(parser, Context.Empty, Errors.Unexpected);
    return nextUnicodeChar(parser);
}

export function nextUnicodeChar(parser: Parser) {
    let { index } = parser;
    const hi = parser.source.charCodeAt(index++);

    if (hi < 0xd800 || hi > 0xdbff) return hi;
    if (index === parser.source.length) return hi;
    const lo = parser.source.charCodeAt(index);

    if (lo < 0xdc00 || lo > 0xdfff) return hi;
    return (hi & 0x3ff) << 10 | lo & 0x3ff | 0x10000;
}

export function isDecimalDigit(code: number): boolean {
    return code >= Chars.Zero && code <= Chars.Nine;
}

export function isSurrogateLead(code: number): boolean {
    return code >= 0xD800 && code <= 0xDBFF;
}

export function isSurrogateTail(code: number): boolean {
    return code >= 0xDC00 && code <= 0xDFFF;
}

export function getSurrogate(hi: number, low: number): number {
    return (hi - 0xD800) * 0x400 + (low - 0xDC00) + 0x10000;
}

export function toHex(code: number): number {
    if (code < Chars.Zero) return -1;
    if (code <= Chars.Nine) return code - Chars.Zero;
    if (code < Chars.UpperA) return -1;
    if (code <= Chars.UpperF) return code - Chars.UpperA + 10;
    if (code < Chars.LowerA) return -1;
    if (code <= Chars.LowerF) return code - Chars.LowerA + 10;
    return -1;
}

export function isHex(code: number): boolean {
    if (code >= Chars.Zero && code <= Chars.Nine) return true;
    const x = code | 32;
    if (x >= Chars.LowerA && x <= Chars.LowerF) return true;
    return false;
}

export const fromCodePoint = (code: Chars) => {
    return code <= 0xFFFF ?
        String.fromCharCode(code) :
        String.fromCharCode(
          ((code - Chars.NonBMPMin) >> 10) + Chars.LeadSurrogateMin,
          ((code - Chars.NonBMPMin) & (1024 - 1)) + Chars.TrailSurrogateMin);
};

export function convertToken(parser: Parser, token: Token): any {
    let type;
    let value;
    if ((token & Token.Punctuator) === Token.Punctuator) {
        type = 'Punctuator';
        value = tokenDesc(token);
    }  else if ((token & Token.Reserved) === Token.Reserved ||
        (token & Token.FutureReserved) === Token.FutureReserved ||
        (token & Token.Contextual) === Token.Contextual) {
            type = 'Keyword';
            value = tokenDesc(token);
    } else {
        value = parser.source.slice(parser.startIndex, parser.index);
        if ((token & Token.NumericLiteral) === Token.NumericLiteral) type = 'Numberic';
        if ((token & Token.Template) === Token.Template) type = 'Template';
        if ((token & Token.StringLiteral) === Token.StringLiteral) type = 'String';
        if ((token & Token.Identifier) === Token.Identifier) type = 'Identifier';
        if ((token & Token.RegularExpression) === Token.RegularExpression) type = 'Null';
        else if (token === Token.NullKeyword) type = 'Null';
        else if (token === Token.FalseKeyword || token === Token.TrueKeyword) {
            type = 'Boolean';
        }
    }
    const t: any = { type, value };
    return t;
}

export function isAsciiLetter(codePoint: number): boolean {
    // make upper and lower case the same value (for the sake of the isletter check).
    // only difference between a lower and upper case ascii letter is the 6th bit (=1<<5=32)
    const d = codePoint | 32;
    return d >= Chars.LowerA && d <= Chars.LowerZ;
}

const enum IntervalQuantifierState {
    Empty = 0,
    Start = 1 << 0,
    IsLow = 1 << 1,
    IsHigh = 1 << 2,
    HasBadNumber = 1 << 3
}

export function parseIntervalQuantifier(parser: Parser): boolean {

    let state = IntervalQuantifierState.Start;
    let min = 0;
    let max = 0;
    let ch = parser.source.charCodeAt(parser.index);

 //   if (!isDecimalDigit(ch)) return false;

    while (isDecimalDigit(ch)) {
        state = state | IntervalQuantifierState.IsLow;
        parser.index++;
        if ((state & IntervalQuantifierState.Start) === IntervalQuantifierState.Start) {
            state = state & ~IntervalQuantifierState.Start;
            if (ch === Chars.Zero) {
                if (parser.index >= parser.length) return false;
                ch = parser.source.charCodeAt(parser.index);
                if (!isDecimalDigit(ch)) break;
                state = state | IntervalQuantifierState.HasBadNumber;
                parser.index++;
            }
        }
        min = (min * 10) + (ch - Chars.Zero);
        ch = parser.source.charCodeAt(parser.index);
    }

    if (consumeOpt(parser, Chars.Comma)) {
        state = state | IntervalQuantifierState.Start;
        if (parser.index >= parser.length) return false;
        while (parser.index < parser.length) {
            ch = parser.source.charCodeAt(parser.index);
            if (!isDecimalDigit(ch)) break;
            parser.index++;
            state = state | IntervalQuantifierState.IsHigh;
            if ((state & IntervalQuantifierState.Start) === IntervalQuantifierState.Start) {
                state = state & ~IntervalQuantifierState.Start;
                if (ch === Chars.Zero) {
                    if (parser.index >= parser.length) return false;
                    ch = parser.source.charCodeAt(parser.index);
                    if (!isDecimalDigit(ch)) break;
                    state = state | IntervalQuantifierState.HasBadNumber;
                    parser.index++;
                }
            }
            max = (max * 10) + (ch - Chars.Zero);
        }
    }

    if ((state & IntervalQuantifierState.HasBadNumber) === IntervalQuantifierState.HasBadNumber ||
    !consumeOpt(parser, Chars.RightBrace)) return false;
    const hasLow = (state & IntervalQuantifierState.IsLow) === IntervalQuantifierState.IsLow;
    const hasHi = (state & IntervalQuantifierState.IsHigh) === IntervalQuantifierState.IsHigh;
    return (hasLow !== hasHi || (hasLow && hasHi && min <= max));
}

export function isFlagStart(code: number) {
    return isValidIdentifierPart(code) ||
        code === Chars.Backslash ||
        code === Chars.Dollar ||
        code === Chars.Underscore ||
        code === Chars.Zwnj ||
        code === Chars.Zwj;
}

export function isIdentRestChr(c: number) {
    if (isAsciiLetter(c)) return true;
    if (isDecimalDigit(c)) return true;
    if (c === Chars.Dollar || c === Chars.Underscore) return true;
    return false;
  }

/**
 * Returns true if valid unicode continue
 *
 * @param {number} code
 * @returns {boolean}
 */
export function isValidUnicodeidcontinue(code: number): boolean {
    return isValidIdentifierPart(code) ||
        code === Chars.Dollar ||
        code === Chars.Underscore ||
        code >= Chars.Zero && code <= Chars.Nine;
}

export function setValidationState(state: RegexpState, escapeStatus: RegexpState): RegexpState {
    if (escapeStatus === RegexpState.Invalid) {
        state = RegexpState.Invalid;
    } else if (escapeStatus === RegexpState.MaybeBothModes) {
        if (state === RegexpState.Valid) state = RegexpState.MaybeBothModes;
        else if (state === RegexpState.UnicodeMode) state = RegexpState.Invalid;
    } else if (escapeStatus === RegexpState.UnicodeMode) {
        if (state === RegexpState.Valid) state = RegexpState.UnicodeMode;
        else if (state === RegexpState.MaybeBothModes) state = RegexpState.Invalid;
    }
    return state;
}

export function setRegExpState(parser: Parser, flagState: RegexpState, bodyState: RegexpState): RegexpState {
    if (parser.capturingParens < parser.largestBackReference) {
        return RegexpState.Invalid
    }
    if (bodyState === RegexpState.Invalid) {
        // body had bad escape
        return RegexpState.Invalid
    }
    if (flagState === RegexpState.Invalid) {
        // body had bad escape or flags occurred twice (should already have called THROW for this)
        return RegexpState.Invalid
    }

    if (bodyState === RegexpState.UnicodeMode) {
        // body had an escape that is only valid with an u flag
        if (flagState === RegexpState.UnicodeMode) return RegexpState.Valid
        return RegexpState.Invalid
    }

    if (bodyState === RegexpState.MaybeBothModes) {

        if (flagState !== RegexpState.UnicodeMode) return RegexpState.Valid
        return RegexpState.Invalid
    }
    if (flagState === RegexpState.UnicodeMode) return RegexpState.Valid
    return RegexpState.Valid
}