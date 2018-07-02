import { Parser } from '../types';
import { Chars } from '../chars';
import { Token } from '../token';
import { Context, Flags } from '../common';
import { consumeOpt, toHex, NumericState } from './common';
import { Errors, recordErrors, report } from '../errors';
import { isValidIdentifierStart } from '../unicode';

// Numeric literals
//
// - Stage 3 proposals included:
// =============================
//
// - Numeric separators (stage-2, removed. see https://tc39.github.io/tc39-notes/2018-05_may-24.html#numeric-separators-update)
// . BigInt
//

// lookup table
const parseLeadingZeroTable: Array<Function> = [];

// binary integer. see [https://tc39.github.io/ecma262/#prod-BinaryIntegerLiteral)
parseLeadingZeroTable[Chars.LowerB] = parseLeadingZeroTable[Chars.UpperB] = (parser: Parser, context: Context) => scanOctalOrBinaryDigits(parser, context, 2);
// octal integer. see [https://tc39.github.io/ecma262/#prod-OctalIntegerLiteral)
parseLeadingZeroTable[Chars.LowerO] = parseLeadingZeroTable[Chars.UpperO] = (parser: Parser, context: Context) => scanOctalOrBinaryDigits(parser, context, 8);
// hex integer. see [https://tc39.github.io/ecma262/#prod-HexIntegerLiteral)
parseLeadingZeroTable[Chars.LowerX] = parseLeadingZeroTable[Chars.UpperX] = scanHexDigits;

// scan implicit oct
parseLeadingZeroTable.fill(scanImplicitOctalDigits, Chars.Zero, Chars.Seven + 1);
// non octal. see [https://tc39.github.io/ecma262/#prod-annexB-NonOctalDigit]
parseLeadingZeroTable[Chars.Eight] = parseLeadingZeroTable[Chars.Nine]
  = (parser: Parser, context: Context) => context & Context.Strict ? report(parser, Errors.Unexpected) : scanNumeric(parser, context);

/**
 *  Scans numeric and decimal literal literal
 *
 * @see [https://tc39.github.io/ecma262/#prod-DecimalLiteral)
 * @see [https://tc39.github.io/ecma262/#prod-NumericLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanNumeric(parser: Parser, context: Context): Token {
  const { index, column } = parser;
  let next = parser.source.charCodeAt(parser.index);
  let state = NumericState.None;
  if (next === Chars.Period) state = state | NumericState.IsFloat;

  if (state & NumericState.IsFloat) {
      parser.tokenValue = scanDecimalDigits(parser);
  } else {

      // Most number values fit into 4 bytes, but for long numbers
      // we would need a workaround...
      const maximumDigits = 10;
      let digit = maximumDigits - 1;
      parser.tokenValue = 0;
      while (digit >= 0 && (next >= Chars.Zero && next <= Chars.Nine || next === Chars.Underscore)) {
          parser.tokenValue = parser.tokenValue * 10 + next - Chars.Zero;
          parser.index++; parser.column++;
          --digit;
          next = parser.source.charCodeAt(parser.index);
      }

      if (digit >= 0 && next !== Chars.Period && (parser.index >= parser.length || !isValidIdentifierStart(next))) {
          if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(index, parser.index);
          return Token.NumericLiteral;
      } else {
          parser.index = index;
          parser.column = column;
          parser.tokenValue = scanDecimalDigits(parser);
      }
  }

  if (consumeOpt(parser, Chars.Period)) {
      state |= NumericState.IsFloat;
      if (parser.source.charCodeAt(parser.index) === Chars.Underscore) report(parser, Errors.ZeroDigitNumericSeparator);
      parser.tokenValue = `${parser.tokenValue}.${scanDecimalDigits(parser)}`;
  }

  const end = parser.index;

  if (parser.source.charCodeAt(parser.index) === Chars.LowerN) {
      if (state & NumericState.IsFloat) report(parser, Errors.Unexpected);
      state = state | NumericState.IsBigInt;
      parser.index++; parser.column++;
  }

  if (consumeOpt(parser, Chars.LowerE) || consumeOpt(parser, Chars.UpperE)) {
      next = parser.source.charCodeAt(parser.index);
      if (consumeOpt(parser, Chars.Plus) || consumeOpt(parser, Chars.Hyphen)) {
          next = parser.source.charCodeAt(parser.index);
      }
      if (!(next >= Chars.Zero && next <= Chars.Nine)) report(parser, Errors.Unexpected);
      const preNumericPart = parser.index;
      const finalFragment = scanDecimalDigits(parser);
      parser.tokenValue = parser.tokenValue += parser.source.substring(end, preNumericPart) + finalFragment;
  }

  if (isValidIdentifierStart(parser.source.charCodeAt(parser.index))) {
      report(parser, Errors.Unexpected);
  }

  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(index, parser.index);
  if (state & NumericState.IsFloat) parser.tokenValue = parseFloat(parser.tokenValue);

  return state & NumericState.IsBigInt ? Token.BigInt : Token.NumericLiteral;
}

/**
 *  Scans binary, octal, hex literal, and numeric literals (Annex B.1.1)
 *
 * @see [https://tc39.github.io/ecma262/#prod-BinaryIntegerLiteral)
 * @see [https://tc39.github.io/ecma262/#prod-OctalIntegerLiteral)
 * @see [https://tc39.github.io/ecma262/#prod-HexIntegerLiteral)
 * @see [https://tc39.github.io/ecma262/#sec-additional-syntax-numeric-literals)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseLeadingZero(parser: Parser, context: Context): Token {
  return (parseLeadingZeroTable[parser.source.charCodeAt(parser.index + 1)] || scanNumeric)(parser, context);
}

/**
 * Scans octal or binary digits
 *
 * @see [https://tc39.github.io/ecma262/#prod-BinaryDigits)
 * @see [https://tc39.github.io/ecma262/#prod-OctalDigit)
 *
 * @param parser Parser object
 * @param base base number
 */

export function scanOctalOrBinaryDigits(parser: Parser, context: Context, base: number): Token {
  const { index } = parser;
  parser.index += 2; parser.column += 2;
  let code = parser.source.charCodeAt(parser.index);
  if (!(code >= Chars.Zero && code <= Chars.Nine)) report(parser, Errors.InvalidOrUnexpectedToken);
  let state = NumericState.None;
  let digits = 0;
  parser.tokenValue = 0;
  while (parser.index < parser.length) {
      code = parser.source.charCodeAt(parser.index);
      const converted = code - Chars.Zero;
      if (!(code >= Chars.Zero && code <= Chars.Nine) || converted >= base) break;
      parser.tokenValue = parser.tokenValue * base + converted;
      parser.index++; parser.column++;
      digits++;
  }

  if (digits === 0) {
      report(parser, Errors.InvalidOrUnexpectedToken);
  }

  if (consumeOpt(parser, Chars.LowerN)) state = state | NumericState.IsBigInt;
  if (isValidIdentifierStart(parser.source.charCodeAt(parser.index))) {
      report(parser, Errors.Unexpected);
  }
  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(index, parser.index);
  return state & NumericState.IsBigInt ? Token.BigInt : Token.NumericLiteral;
}

/**
 * Scans hex digits
 *
 * @see [https://tc39.github.io/ecma262/#prod-HexDigits)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanHexDigits(parser: Parser, context: Context): Token {
  const { index } = parser;
  parser.index += 2; parser.column += 2;
  parser.tokenValue = toHex(parser.source.charCodeAt(parser.index));
  if (parser.tokenValue < 0) report(parser, Errors.Unexpected);
  parser.index++; parser.column++;
  let state = NumericState.None;
  while (parser.index < parser.length) {
      const next = parser.source.charCodeAt(parser.index);
      const digit = toHex(next);
      if (digit < 0) break;
      state = NumericState.None;
      parser.tokenValue = parser.tokenValue * 16 + digit;
      parser.index++; parser.column++;
  }
  if (consumeOpt(parser, Chars.LowerN)) state = state | NumericState.IsBigInt;
  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(index, parser.index);
  return state & NumericState.IsBigInt ? Token.BigInt : Token.NumericLiteral;
}

/**
 * Scans implicit octals
 *
 * @see [https://tc39.github.io/ecma262/#sec-additional-syntax-numeric-literals)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanImplicitOctalDigits(parser: Parser, context: Context): Token {
  let { index, column } = parser;
  const start = index;
  if (context & Context.Strict) recordErrors(parser, context, Errors.Unexpected);
  let next = parser.source.charCodeAt(parser.index);
  parser.tokenValue = 0;
  parser.flags |= Flags.HasOctal;

  // Implicit octal, unless there is a non-octal digit.
  // (Annex B.1.1 on Numeric Literals)
  while (index < parser.length &&
    (next = parser.source.charCodeAt(index), (next >= Chars.Zero && next <= Chars.Nine))) {
      if (next === Chars.Eight || next === Chars.Nine) return scanNumeric(parser, context);
      parser.tokenValue = parser.tokenValue * 8 + (next - Chars.Zero);
      index++; column++;
  }

  parser.index = index;
  parser.column = column;
  if (isValidIdentifierStart(next)) report(parser, Errors.Unexpected);
  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(start, parser.index);
  return Token.NumericLiteral;
}

/**
 * Scans decimal digit or separator
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanDecimalDigits(parser: Parser): string {
  const start = parser.index;
  const result = '';
  while (parser.index < parser.length) {
      const ch = parser.source.charCodeAt(parser.index);
      if (!(ch >= Chars.Zero && ch <= Chars.Nine)) break;
      parser.index++; parser.column++;

  }
  return result + parser.source.substring(start, parser.index);
}
