import { Token } from '../token';
import { Context, Flags } from '../common';
import { consumeOpt } from './common';
import { Chars } from '../chars';
import { Parser } from '../types';
import { Errors, report } from '../errors';

// 11.4 Comments
/**
 * Skips single HTML comments. Same behavior as in V8.
 *
 * @param parser Parser Object
 * @param context Context masks.
 */
export function skipSingleHTMLComment(parser: Parser, context: Context): Token {
   if (context & Context.Module) report(parser, Errors.HtmlCommentInModule);
   skipSingleLineComment(parser, Token.HTMLComment);
   return Token.HTMLComment;
}

/**
 * Skips SingleLineComment, SingleLineHTMLCloseComment and SingleLineHTMLOpenComment
 *
 *  @see [Link](https://tc39.github.io/ecma262/#prod-SingleLineComment)
 *  @see [Link](https://tc39.github.io/ecma262/#prod-annexB-SingleLineHTMLOpenComment)
 *  @see [Link](https://tc39.github.io/ecma262/#prod-annexB-SingleLineHTMLCloseComment)
 *
 * @param parser Parser object
 * @param returnToken Token to be returned
 */
export function skipSingleLineComment(parser: Parser, returnToken: Token = Token.SingleComment): Token {
  let lastIsCR = 0;
  while (parser.index < parser.length) {
      switch (parser.source.charCodeAt(parser.index)) {
          case Chars.CarriageReturn:
              lastIsCR = 2;
          case Chars.LineFeed:
          case Chars.LineSeparator:
          case Chars.ParagraphSeparator:
              if (!--lastIsCR) parser.line++;
              parser.flags |= Flags.NewLine;
              parser.index++;
              parser.column = 0;
              parser.line++;
              return returnToken;
          default:
              if (lastIsCR) {
                  parser.line++;
                  lastIsCR = 0;
              }
              parser.column++;
              parser.index++;
      }
  }

  return returnToken;
}

/**
 * Skips multiline comment
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-annexB-MultiLineComment)
 *
 * @param parser Parser object
 */
export function skipMultilineComment(parser: Parser): any {
  let lastIsCR = 0;
  while (parser.index < parser.length) {
      switch (parser.source.charCodeAt(parser.index)) {
          case Chars.Asterisk:
              parser.index++;
              parser.column++;
              if (consumeOpt(parser, Chars.Slash)) {
                return Token.MultiComment;
              }
              break;
          case Chars.CarriageReturn:
              lastIsCR = 2;
          case Chars.LineFeed:
          case Chars.LineSeparator:
          case Chars.ParagraphSeparator:
              if (!--lastIsCR) parser.line++;
              parser.flags |= Flags.NewLine;
              parser.index++;
              parser.column = 0;
              break;
          default:
              if (lastIsCR) {
                  parser.line++;
                  lastIsCR = 0;
              }
              parser.index++;
              parser.column++;
      }
  }

  report(parser, Errors.UnterminatedComment);
}
