import { Parser } from '../types';
import { Token } from '../token';
import { Chars } from '../chars';
import { Context, Flags } from '../common';
import { Errors, recordErrors } from '../errors';
import { isValidIdentifierPart } from '../unicode';
import { isHex, consumeOpt } from './common';

    function scanRegexBody(parser: Parser, context: Context, depth: number, type: number): Type {

        let maybeQuantifier = false;

        while (parser.index != parser.length) {

            switch (parser.source.charCodeAt(parser.index++)) {

                // `^`, `.`, `$`
                case Chars.Caret:
                case Chars.Period:
                case Chars.Dollar:
                    maybeQuantifier = true;
                    break;

                    // `|`
                case Chars.VerticalBar:
                    maybeQuantifier = false;
                    break;

                // '/'
                case Chars.Slash:
                    if (depth) return recordRegExpErrors(parser, context, Errors.UnterminatedGroup);
                    return type;

                    // Atom ::
                    //   \ AtomEscape
                case Chars.Backslash:
                    {
                      if (parser.index >= parser.length) return recordRegExpErrors(parser, context,  Errors.Unexpected);

                      maybeQuantifier = true;

                      let subType = Type.Valid;

                        const next = parser.source.charCodeAt(parser.index);

                        switch (next) {

                            // 'b', 'B'
                            case Chars.LowerB:
                            case Chars.UpperB:
                                parser.index++;
                                maybeQuantifier = false;
                                break;

                            // 'u'
                            case Chars.LowerU:
                                parser.index++;
                                subType = validateUnicodeEscape(parser, context);
                                break;

                             // 'x', 'X'
                            case Chars.UpperX:
                            case Chars.LowerX: {
                                  parser.index++;
                                   if (parser.index >= parser.length) {
                                    subType = recordRegExpErrors(parser, context,  Errors.Unexpected);
                                } else if (!isHex(parser.source.charCodeAt(parser.index))) {
                                    subType = recordRegExpErrors(parser, context,  Errors.Unexpected);
                                } else {
                                    parser.index++;
                                    if (parser.index >= parser.length) {
                                        subType = recordRegExpErrors(parser, context,  Errors.Unexpected);
                                    }

                                    if (!isHex(parser.source.charCodeAt(parser.index))) {
                                        subType = recordRegExpErrors(parser, context,  Errors.Unexpected);
                                        break;
                                    }
                                    parser.index++;
                                }
                                break;
                            }

                            // 'c'
                            case Chars.LowerC: {
                                parser.index++;
                                if (parser.index >= parser.length) return recordRegExpErrors(parser, context,  Errors.Unexpected);
                                if (isAZaz(parser.source.charCodeAt(parser.index))) {
                                    parser.index++;
                                    subType = Type.Valid;
                                    break;
                                }
                                subType = recordRegExpErrors(parser, context,  Errors.Unexpected);
                                break;
                            }
                                // ControlEscape :: one of
                                //   f n r t v
                            case Chars.LowerF:
                            case Chars.LowerN:
                            case Chars.LowerR:
                            case Chars.LowerT:
                            case Chars.LowerV:

                                // AtomEscape ::
                                //   CharacterClassEscape
                                //
                                // CharacterClassEscape :: one of
                                //   d D s S w W
                            case Chars.UpperD:
                            case Chars.LowerD:
                            case Chars.UpperS:
                            case Chars.LowerS:
                            case Chars.UpperW:
                            case Chars.LowerW:
                            case Chars.Caret:
                            case Chars.Dollar:
                            case Chars.Backslash:
                            case Chars.Period:
                            case Chars.Asterisk:
                            case Chars.Plus:
                            case Chars.QuestionMark:
                            case Chars.LeftParen:
                            case Chars.RightParen:
                            case Chars.LeftBracket:
                            case Chars.RightBracket:
                            case Chars.LeftBrace:
                            case Chars.RightBrace:
                            case Chars.VerticalBar:
                            case Chars.Slash:
                                parser.index++;
                                break;

                                // '0'
                            case Chars.Zero:
                                parser.index++;
                                if (isDecimalDigit(parser.source.charCodeAt(parser.index))) return recordRegExpErrors(parser, context,  Errors.Unexpected);
                                break;

                                // '1' - '9'
                            case Chars.One:
                            case Chars.Two:
                            case Chars.Three:
                            case Chars.Four:
                            case Chars.Five:
                            case Chars.Six:
                            case Chars.Seven:
                            case Chars.Eight:
                            case Chars.Nine:
                                subType = parseBackReferenceIndex(parser, next);
                                break;
                            case Chars.CarriageReturn:
                            case Chars.LineFeed:
                            case Chars.ParagraphSeparator:
                            case Chars.LineSeparator:
                                parser.index++;
                                subType = recordRegExpErrors(parser, context,  Errors.Unexpected);
                                break;
                            default:
                                if (isValidUnicodeidcontinue(next)) return recordRegExpErrors(parser, context,  Errors.Unexpected);
                                parser.index++;
                                subType = Type.MaybeUnicode;
                        }

                        type = getRegExpState(parser, context, type, subType);
                        break;
                    }

                    // '('
                case Chars.LeftParen:
                    {
                        if (parser.index >= parser.length) return recordRegExpErrors(parser, context,  Errors.Unexpected);

                        if (consumeOpt(parser, Chars.QuestionMark)) {

                            if (parser.index >= parser.length) return recordRegExpErrors(parser, context,  Errors.Unexpected);

                            switch (parser.source.charCodeAt(parser.index)) {

                                // ':', '=', '?'
                                case Chars.Colon:
                                case Chars.EqualSign:
                                case Chars.Exclamation:
                                    parser.index++;
                                    // non capturing group
                                    if (parser.index >= parser.length) return recordRegExpErrors(parser, context,  Errors.Unexpected);

                                    break;
                                default:
                                    type = recordRegExpErrors(parser, context,  Errors.Unexpected);
                            }
                        } else {
                            ++parser.capturingParens;
                        }

                        const subType = scanRegexBody(parser, context, depth + 1, Type.Valid);
                        maybeQuantifier = true;
                        type = getRegExpState(parser, context, type, subType);
                        break;
                    }

                    // `)`
                case Chars.RightParen:
                    if (depth > 0) return type;
                    type = recordRegExpErrors(parser, context,  Errors.InvalidGroup);
                    maybeQuantifier = true;
                    break;

                    // '['
                case Chars.LeftBracket:
                    const subType = parseCharacterClass(parser, context);
                    type = getRegExpState(parser, context, type, subType);
                    maybeQuantifier = true;
                    break;

                    // ']'
                case Chars.RightBracket:
                    type = recordRegExpErrors(parser, context,  Errors.Unexpected);
                    maybeQuantifier = true;
                    break;

                    // '*', '+', '?'
                case Chars.Asterisk:
                case Chars.Plus:
                case Chars.QuestionMark:
                    if (maybeQuantifier) {
                        maybeQuantifier = false;
                        if (parser.index < parser.length) {
                            consumeOpt(parser, Chars.QuestionMark);
                        }
                    } else {
                        type = recordRegExpErrors(parser, context,  Errors.NothingToRepeat);
                    }
                    break;

                    // '{'
                case Chars.LeftBrace:

                    if (maybeQuantifier) {
                        if (!parseIntervalQuantifier(parser)) {
                            type = recordRegExpErrors(parser, context,  Errors.NothingToRepeat);
                        }
                        if (parser.index < parser.length) {
                            consumeOpt(parser, Chars.QuestionMark);
                        }
                        maybeQuantifier = false;
                    } else {
                        type = recordRegExpErrors(parser, context,  Errors.NothingToRepeat);
                    }
                    break;

                    // '}'
                case Chars.RightBrace:
                    type = recordRegExpErrors(parser, context,  Errors.NothingToRepeat);
                    maybeQuantifier = false;
                    break;

                    // `LineTerminator`
                case Chars.CarriageReturn:
                case Chars.LineFeed:
                case Chars.ParagraphSeparator:
                case Chars.LineSeparator:
                    return recordRegExpErrors(parser, context,  Errors.Unexpected);
                default:
                maybeQuantifier = true;
            }
        }

        // Invalid regular expression
        return recordRegExpErrors(parser, context,  Errors.Unexpected);
    }

