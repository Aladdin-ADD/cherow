import { Parser } from '../types';
import { Token } from '../token';
import { Context, Flags } from '../common';
import { Chars } from '../chars';
import { Errors, recordErrors, report } from '../errors';
import { isValidIdentifierStart, isValidIdentifierPart, mustEscape } from '../unicode';

/* Numeric literal state */
export const enum NumericState {
  None         = 0,
  IsFloat      = 1 << 0,
  IsBigInt     = 1 << 1,
}

/* Sting / template literal escapes */
export const enum Escape {
  Empty       = -1,
  StrictOctal = -2,
  EightOrNine = -3,
  InvalidHex  = -4,
  OutOfRange  = -5,
}

/* Regular expression class range state */
export const enum ClassRangesState {
  Empty            = 0,
  IsTrailSurrogate = 1 << 0,
  IsSurrogateLead  = 1 << 2,
  SeenUnicoderange = 1 << 8,
  InCharacterRange = 1 << 10,
}

/**
 * Consume an token in the scanner on match. This is an equalent to
 * 'consume' used in the parser code itself.
 *
 * @param parser Parser object
 * @param ch Codepoint
 */
export function consumeOpt(parser: Parser, ch: number): boolean {
  if (parser.source.charCodeAt(parser.index) !== ch) return false;
  parser.index++; parser.column++;
  return true;
}

/**
 * Skips BOM and shebang
 *
 * parser Parser object
 */
export function skipBomAndShebang(parser: Parser, context: Context): void {
  let index = parser.index;
  if (index === parser.source.length) return;
  if (parser.source.charCodeAt(index) === Chars.ByteOrderMark) {
      index++;
      parser.index = index;
  }

  if (context & Context.OptionsShebang && index < parser.source.length && parser.source.charCodeAt(index) === Chars.Hash) {
      index++;
      if (index < parser.source.length && parser.source.charCodeAt(index) === Chars.Exclamation) {
          parser.index = index + 1;
          loop:
              while (parser.index < parser.length) {
                  const ch = parser.source.charCodeAt(parser.index);
                  switch (ch) {
                      case Chars.CarriageReturn:
                      case Chars.LineFeed:
                      case Chars.LineSeparator:
                      case Chars.ParagraphSeparator:
                      parser.flags |= Flags.NewLine;
                      parser.index++; parser.column = 0; parser.line++;
                      if (parser.index < parser.length && ch === Chars.CarriageReturn &&
                            parser.source.charCodeAt(parser.index) === Chars.LineFeed) {
                            parser.index++;
                        }
                      break loop;
                      default:
                          parser.index++;
                          parser.column++;
                  }
              }
      }
  }
  // Note: The lexer will take it over from here and either find a private name (#) or simply
  // throw an error
}

/**
 * Scans private name. Stage 3 proposal related
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanPrivateName(parser: Parser, context: Context): Token {
  let index = parser.index;
  const next = parser.source.charCodeAt(index + 1);
  if (!(context & Context.InClass) || index < parser.source.length && !isValidIdentifierStart(next)) {
      index++;
      report(parser, Errors.InvalidPrivateFieldAccess, escapeInvalidCharacters(next));
  }
  return Token.Hash;
}

export function readNext(parser: Parser, ch: number): number {
  parser.index++;
  parser.column++;
  if (ch > 0xFFFF) parser.index++;
  if (parser.index >= parser.length) recordErrors(parser, Context.Empty, Errors.Unexpected);
  return nextUnicodeChar(parser);
}

export function nextUnicodeChar(parser: Parser): number {
  let { index } = parser;
  const hi = parser.source.charCodeAt(index++);

  if (hi < 0xD800 || hi > 0xDBFF) return hi;
  if (index === parser.source.length) return hi;
  const lo = parser.source.charCodeAt(index);

  if (lo < 0xDC00 || lo > 0xDFFF) return hi;
  return (hi & 0x3FF) << 10 | lo & 0x3FF | 0x10000;
}

export function isDecimalDigit(code: number): boolean {
  return code >= Chars.Zero && code <= Chars.Nine;
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

export const fromCodePoint = (code: Chars) => {
  return code <= 0xFFFF ?
      String.fromCharCode(code) :
      String.fromCharCode(
          ((code - Chars.NonBMPMin) >> 10) + Chars.LeadSurrogateMin,
          ((code - Chars.NonBMPMin) & (1024 - 1)) + Chars.TrailSurrogateMin);
};

export function isFlagStart(code: number): boolean {
  return isValidIdentifierPart(code) ||
      code === Chars.Backslash ||
      code === Chars.Dollar ||
      code === Chars.Underscore ||
      code === Chars.Zwnj ||
      code === Chars.Zwj;
}

/**
 * Returns true if valid unicode continue
 *
 */
export function isValidUnicodeidcontinue(code: number): boolean {
  return isValidIdentifierPart(code) ||
      code === Chars.Dollar ||
      code === Chars.Underscore ||
      code >= Chars.Zero && code <= Chars.Nine;
}

export function mapToToken(token: Token): (parser: Parser) => Token {
  return (parser: Parser) => {
      parser.index++;
      parser.column++;
      return token;
  };
}

export function escapeInvalidCharacters(code: number): string {
  switch (code) {
      case Chars.Null:
          return '\\0';
      case Chars.Backspace:
          return '\\b';
      case Chars.Tab:
          return '\\t';
      case Chars.LineFeed:
          return '\\n';
      case Chars.VerticalTab:
          return '\\v';
      case Chars.FormFeed:
          return '\\f';
      case Chars.CarriageReturn:
          return '\\r';
      case Chars.Hash:
          return '\\#';
      case Chars.At:
          return '\\@';
      default:
          if (!mustEscape(code)) return fromCodePoint(code);
          if (code < 0x10) return `\\x0${code.toString(16)}`;
          if (code < 0x100) return `\\x${code.toString(16)}`;
          if (code < 0x1000) return `\\u0${code.toString(16)}`;
          if (code < 0x10000) return `\\u${code.toString(16)}`;
          return `\\u{${code.toString(16)}}`;
  }
}

/**
 * Throws a string error for either string or template literal
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function recordStringErrors(parser: Parser, code: Escape): void {
  switch (code) {
      case Escape.Empty:
          return;
      case Escape.StrictOctal:
          report(parser, Errors.StrictOctalEscape);
      case Escape.EightOrNine:
          report(parser, Errors.InvalidEightAndNine);
      case Escape.InvalidHex:
          report(parser, Errors.InvalidEscape);
      case Escape.OutOfRange:
          report(parser, Errors.InvalidEscape);
      default:
          // ignore
  }
}

export function isIdentifierPart(code: Chars): boolean {
  const letter = code | 32;
  return (letter >= Chars.LowerA && letter <= Chars.LowerZ) ||
      code === Chars.Underscore ||
      code === Chars.Dollar ||
      code === Chars.Backslash ||
      (code >= Chars.Zero && code <= Chars.Nine // 0..9;
          || isValidIdentifierPart(code));
}

export function isWhiteSpaceSingleLine(ch: number): boolean {
  return ch === Chars.Space ||
      ch === Chars.Tab ||
      ch === Chars.VerticalTab ||
      ch === Chars.FormFeed ||
      ch === Chars.NonBreakingSpace ||
      ch === Chars.NextLine ||
      ch === Chars.Ogham ||
      ch >= Chars.EnQuad && ch <= Chars.ZeroWidthSpace ||
      ch === Chars.NarrowNoBreakSpace ||
      ch === Chars.MathematicalSpace ||
      ch === Chars.IdeographicSpace;
}

/**
 * Returns true if ascii identifier - no unicode
 *
 * @param code Code point
 */
export function isAsciiCodePoint(code: number): boolean {
  const letter = code | 32;
  if (letter >= Chars.LowerA && letter <= Chars.LowerZ) return true;
  return letter >= Chars.LowerA && letter <= Chars.LowerZ ||
          code === Chars.Dollar ||
          code === Chars.Underscore ||
          (code >= Chars.Zero && code <= Chars.Nine);
}
