import { Parser } from '../types';
import { Token } from '../token';
import { Chars } from '../chars';
import { Context, Flags } from '../common';
import { toHex, nextUnicodeChar, readNext, fromCodePoint, Escape, recordStringErrors } from './common';
import { Errors, report } from '../errors';

/**
 * Scan a string literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-literals-string-literals)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param quote codepoint
 */
export function scanStringLiteral(parser: Parser, context: Context, quote: number): Token {

  const { index: start, lastValue } = parser;
  let ret = '';

  let ch = readNext(parser, quote);

  while (ch !== quote) {
      switch (ch) {
          case Chars.Backslash:
              ch = readNext(parser, ch);

              if (ch >= 128) {
                  ret += fromCodePoint(ch);
              } else {
                  parser.lastValue = ch;
                  const code = table[ch](parser, context, ch);
                  if (code >= 0) ret += fromCodePoint(code);
                  else recordStringErrors(parser, code as Escape);
                  ch = parser.lastValue;
              }
              break;
          case Chars.CarriageReturn:
          case Chars.LineFeed:
              report(parser, Errors.UnterminatedString);
          default:
              ret += fromCodePoint(ch);
      }

      ch = readNext(parser, ch);
  }

  parser.index++;
  parser.column++; // Consume the quote
  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(start, parser.index);
  parser.tokenValue = ret;
  parser.lastValue = lastValue;

  return Token.StringLiteral;
}

export const table = new Array < (parser: Parser, context: Context, first: number) => number > (128).fill(nextUnicodeChar);

// Magic escapes
table[Chars.LowerB] = () => Chars.Backspace;
table[Chars.LowerF] = () => Chars.FormFeed;
table[Chars.LowerR] = () => Chars.CarriageReturn;
table[Chars.LowerN] = () => Chars.LineFeed;
table[Chars.LowerT] = () => Chars.Tab;
table[Chars.LowerV] = () => Chars.VerticalTab;

// Line continuations
table[Chars.CarriageReturn] = parser => {
  parser.column = -1;
  parser.line++;

  const { index } = parser;

  if (index < parser.source.length) {
      const ch = parser.source.charCodeAt(index);

      if (ch === Chars.LineFeed) {
          parser.lastValue = ch;
          parser.index = index + 1;
      }
  }

  return Escape.Empty;
};

table[Chars.LineFeed] =
  table[Chars.LineSeparator] =
  table[Chars.ParagraphSeparator] = parser => {
      parser.column = -1;
      parser.line++;
      return Escape.Empty;
  };

// Null character, octals
table[Chars.Zero] = table[Chars.One] = table[Chars.Two] =  table[Chars.Three] = (
  parser, context, first
) => {
      // 1 to 3 octal digits
      let code = first - Chars.Zero;
      let index = parser.index + 1;
      let column = parser.column + 1;
      if (index < parser.source.length) {
          let next = parser.source.charCodeAt(index);
          if (next < Chars.Zero || next > Chars.Seven) {
              // Strict mode code allows only \0, then a non-digit.
              if (code !== 0 || next === Chars.Eight || next === Chars.Nine) {
                  if (context & Context.Strict) return Escape.StrictOctal;
                  parser.flags = parser.flags | Flags.HasOctal;

                }
          } else if (context & Context.Strict) {
              return Escape.StrictOctal;
          } else {
              parser.flags = parser.flags | Flags.HasOctal;
              parser.lastValue = next;
              code = code * 8 + (next - Chars.Zero);
              index++;
              column++;

              if (index < parser.source.length) {
                  next = parser.source.charCodeAt(index);

                  if (next >= Chars.Zero && next <= Chars.Seven) {
                      parser.lastValue = next;
                      code = code * 8 + (next - Chars.Zero);
                      index++;
                      column++;
                  }
              }

              parser.index = index - 1;
              parser.column = column - 1;
          }
      }

      return code;
  };

table[Chars.Four] = table[Chars.Five] = table[Chars.Six] = table[Chars.Seven] = (
  parser, context, first
) => {
      if (context & Context.Strict) return Escape.StrictOctal;
      let code = first - Chars.Zero;
      const index = parser.index + 1;
      const column = parser.column + 1;

      if (index < parser.source.length) {
          const next = parser.source.charCodeAt(index);
          if (next >= Chars.Zero && next <= Chars.Seven) {
              code = code * 8 + (next - Chars.Zero);
              parser.lastValue = next;
              parser.index = index;
              parser.column = column;
          }
      }

      return code;
  };

table[Chars.Eight] = table[Chars.Nine] = () => Escape.EightOrNine;

// ASCII escapes
table[Chars.LowerX] = (parser, _, first) => {
  const ch1 = parser.lastValue = readNext(parser, first);
  const hi = toHex(ch1);
  if (hi < 0 || parser.index >= parser.length) return Escape.InvalidHex;
  const ch2 = parser.lastValue = readNext(parser, ch1);
  const lo = toHex(ch2);
  if (lo < 0) return Escape.InvalidHex;

  return hi * 16 + lo;
};

table[Chars.LowerU] = (parser, _, prev) => {
  let ch = parser.lastValue = readNext(parser, prev);
  if (ch === Chars.LeftBrace) {
      // \u{N}
      ch = parser.lastValue = readNext(parser, ch);
      let code = toHex(ch);
      if (code < 0) return Escape.InvalidHex;

      ch = parser.lastValue = readNext(parser, ch);
      while (ch !== Chars.RightBrace) {
          const digit = toHex(ch);
          if (digit < 0) return Escape.InvalidHex;
          code = code * 16 + digit;
          // Code point out of bounds
          if (code > Chars.NonBMPMax) return Escape.OutOfRange;
          ch = parser.lastValue = readNext(parser, ch);
      }

      return code;
  } else {
      // \uNNNN
      let code = toHex(ch);
      if (code < 0) return Escape.InvalidHex;

      for (let i = 0; i < 3; i++) {
          ch = parser.lastValue = readNext(parser, ch);
          const digit = toHex(ch);
          if (digit < 0) return Escape.InvalidHex;
          if (code < 0) return Escape.InvalidHex;
          code = code * 16 + digit;
      }

      return code;
  }
};
