import { Parser } from '../types';
import { consumeOpt } from '../lexer/common';
import { Chars } from '../chars';
import { isValidIdentifierPart } from '../unicode';

/* Regular expression flags */
export const enum RegExpFlags {
  Empty       = 0,
  Global      = 1 << 0,
  IgnoreCase  = 1 << 1,
  Multiline   = 1 << 2,
  Unicode     = 1 << 3,
  Sticky      = 1 << 4,
  DotAll      = 1 << 5
}

/* Regular expression class range state */
export const enum ClassRangesState {
  Empty            = 0,
  IsTrailSurrogate = 1 << 0,
  IsSurrogateLead  = 1 << 2,
  SeenUnicoderange = 1 << 8,
  InCharacterRange = 1 << 10,
}

/* Regular expression quantifier prefix */
const enum QuantifierPrefixState {
  Empty        = 0,
  Start        = 1 << 0,
  IsLow        = 1 << 1,
  IsHigh       = 1 << 2,
  HasBadNumber = 1 << 3
}

/* Regular expression state */
export const enum RegexpState {
  InvalidClassEscape        = 1 << 0,
  ValidClassEscape          = 1 << 6,
  UnicodeMode               = 1 << 10,
  SloppyMode                = 1 << 12,
  OnlySloppy                = 1 << 14,
  Valid                     = 1 << 16,
  Invalid                   = 1 << 18,
  InvalidCharClassInSloppy  = 1 << 24,
  Quantifier                = 1 << 25,
  MissingDigits             = 1 << 26,
  EndOfRegex                = 1 << 27,

  InvalidCharClass          = 0x110000,
  InvalidCharClassRange     = 0x110001,
}
// QuantifierPrefix ::
//   { DecimalDigits }
//   { DecimalDigits , }
//   { DecimalDigits , DecimalDigits }
//
// Returns true if parsing succeeds, and set the min_out and max_out
// values. Values are truncated to RegExpTree::kInfinity if they overflow.
export function validateQuantifierPrefix(parser: Parser): boolean | number {

  let state = QuantifierPrefixState.Start;
  let min = 0;
  let max = 0;
  let ch = parser.source.charCodeAt(parser.index);
  const missingDigits = !(ch >= Chars.Zero && ch <= Chars.Nine);

  while (ch >= Chars.Zero && ch <= Chars.Nine) {
      state = state | QuantifierPrefixState.IsLow;
      parser.index++;
      parser.column++;
      if (state & QuantifierPrefixState.Start) {
          state = state & ~QuantifierPrefixState.Start;
          if (ch === Chars.Zero) {
              if (parser.index >= parser.length) return false;
              ch = parser.source.charCodeAt(parser.index);
              if (!(ch >= Chars.Zero && ch <= Chars.Nine)) break;
              state = state | QuantifierPrefixState.HasBadNumber;
              parser.index++;
              parser.column++;
          }
      }
      min = (min * 10) + (ch - Chars.Zero);
      ch = parser.source.charCodeAt(parser.index);
  }

  if (consumeOpt(parser, Chars.Comma)) {
      state = state | QuantifierPrefixState.Start;
      if (parser.index >= parser.length) return false;
      while (parser.index < parser.length) {
          ch = parser.source.charCodeAt(parser.index);
          if (!(ch >= Chars.Zero && ch <= Chars.Nine)) break;
          parser.index++;
          parser.column++;
          state = state | QuantifierPrefixState.IsHigh;
          if (state & QuantifierPrefixState.Start) {
              state = state & ~QuantifierPrefixState.Start;
              if (ch === Chars.Zero) {
                  if (parser.index >= parser.length) return false;
                  ch = parser.source.charCodeAt(parser.index);
                  if (!(ch >= Chars.Zero && ch <= Chars.Nine)) break;
                  state = state | QuantifierPrefixState.HasBadNumber;
                  parser.index++;
                  parser.column++;
              }
          }
          max = (max * 10) + (ch - Chars.Zero);
      }
  }

  if (state & QuantifierPrefixState.HasBadNumber || !consumeOpt(parser, Chars.RightBrace)) return false;
  const hasLow = (state & QuantifierPrefixState.IsLow) > 0;
  const hasHi = (state & QuantifierPrefixState.IsHigh) > 0;
  const res: any = (hasLow !== hasHi || (hasLow && hasHi && min <= max));
  return missingDigits ? res | RegexpState.MissingDigits : res;
}

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

/**
 * Adjust correct regexp validator state
 *
 * @param parser Parser object
 * @param code Code point
 */
export function setValidationState(prevState: RegexpState, currState: RegexpState): RegexpState {
  if (currState & RegexpState.Invalid) return RegexpState.Invalid;
  if (currState & RegexpState.SloppyMode) {
      if (prevState & RegexpState.Valid) return RegexpState.SloppyMode;
      if (prevState & RegexpState.UnicodeMode) return RegexpState.Invalid;
  } else if (currState & RegexpState.UnicodeMode) {
      if (prevState & RegexpState.Valid) return RegexpState.UnicodeMode;
      if (prevState & RegexpState.SloppyMode) return RegexpState.Invalid;
  }
  return prevState;
}

/**
 * Adjust correct regexp validator state
 *
 * @param parser Parser object
 * @param flagState State returned by the regular expression flag
 * @param bodyState State returned after parsing the regex body
 */

export function setRegExpState(parser: Parser, flagState: RegexpState, bodyState: RegexpState): RegexpState {
  if (parser.capturingParens < parser.largestBackReference) return RegexpState.Invalid;
  if (bodyState & RegexpState.Invalid || flagState & RegexpState.Invalid) return RegexpState.Invalid;
  if (bodyState & RegexpState.UnicodeMode) return flagState & RegexpState.UnicodeMode ? RegexpState.Valid : RegexpState.Invalid;
  if (bodyState & RegexpState.OnlySloppy) return !(flagState & RegexpState.UnicodeMode) ? RegexpState.Valid : RegexpState.Invalid;
  if (bodyState & RegexpState.SloppyMode) return !(flagState & RegexpState.UnicodeMode) ? RegexpState.Valid : RegexpState.Invalid;
  return RegexpState.Valid;
}

/**
 * Parse back reference index
 *
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape)
 *
 * @param parser Parser object
 * @param code Code point
 */
export function parseBackReferenceIndex(parser: Parser, code: number): RegexpState {
  let value = code - Chars.Zero;
  while (parser.index < parser.length) {
      code = parser.source.charCodeAt(parser.index);
      if (code >= Chars.Zero && code <= Chars.Nine) {
          value = value * 10 + (code - Chars.Zero);
          parser.index++; parser.column++;
      } else {
          break;
      }
  }

  parser.largestBackReference = value;
  return RegexpState.Valid;
}
