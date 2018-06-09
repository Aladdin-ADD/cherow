import { Parser } from '../types';
import { Chars } from '../chars';
import { Token, descKeyword } from '../token';
import { Context } from '../common';
import { isValidIdentifierPart } from '../unicode';

export const isIdentifierPart = (code: Chars) => isValidIdentifierPart(code) ||
        code === Chars.Backslash ||
        code === Chars.Dollar ||
        code === Chars.Underscore ||
        (code >= Chars.Zero && code <= Chars.Nine); // 0..9;
export function scanIdentifier(parser: Parser): Token {
  const { index: start } = parser;
  let code = parser.source.charCodeAt(parser.index);
  while (parser.index < parser.length && isIdentifierPart(code)) {
    parser.index++;  parser.column++;
    code = parser.source.charCodeAt(parser.index);
  }
  const ret = parser.source.slice(parser.startIndex, parser.index);
  const len = ret.length;
  parser.tokenValue = ret;

  // Keywords are between 2 and 11 characters long and start with a lowercase letter
  // https://tc39.github.io/ecma262/#sec-keywords
  if (len >= 2 && len <= 11) {
      const token = descKeyword(ret);
      if (token > 0) {
          return token;
      }
  }

  return Token.Identifier;
}