import { Token, tokenDesc } from '../token';
import { Context, Flags } from '../common';
import { consumeOpt, advanceNewline, skipToNewline, consumeLineFeed } from './common';
import { Chars } from '../chars';
import { Parser } from '../types';

export function skipSingleHTMLComment(parser: Parser): any {
   // if (context & Context.Module) report(parser, Errors.HtmlCommentInModule);
    skipToNewline(parser);
    return Token.HTMLComment;
}

export function skipSingleLineComment(parser: Parser): any {
     skipToNewline(parser);
     return Token.SingleComment;
 }

export function skipMultilineComment(parser: Parser): any {
    while (parser.index < parser.length) {
        const ch = parser.source.charCodeAt(parser.index);
        switch (ch) {
            case Chars.Asterisk:
                parser.index++; parser.column++;
                if (consumeOpt(parser, Chars.Slash)) return Token.MultiComment;
                break;
            case Chars.CarriageReturn: case Chars.LineFeed: case Chars.LineSeparator:
            case Chars.ParagraphSeparator:
                advanceNewline(parser, ch);
                break;

            default:
                 parser.index++; parser.column++;
        }
    }
}
