import { Parser } from '../types';
import { Chars } from '../chars';
import { Context } from '../common';
import { Token } from '../token';
import { Errors, recordErrors } from '../errors';
import { consumeOpt, toHex } from '../lexer/common';
import {
    parseBackReferenceIndex,
    validateQuantifierPrefix,
    ClassRangesState,
    setRegExpState,
    setValidationState,
    RegexpState,
    RegExpFlags,
    isFlagStart
} from './common';

// WIP

// TODO:
//
// - Adjusts masks and fix non-failing tests
// - Add in error support
// - Optimize
// - Maybe convert 'validateRegexBody' to a lookup table
//

/**
 * Validate the regular expression body
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 * @param depth Depth
 * @param state Validation state
 */
export function validateRegexBody(
    parser: Parser,
    context: Context,
    depth: number,
    state: RegexpState
): RegexpState {

    let maybeQuantifier = false;

    while (parser.index !== parser.length) {

        switch (parser.source.charCodeAt(parser.index++)) {

            // `/`
            case Chars.Slash:

                if (depth !== 0) return RegexpState.Invalid;
                return state;

            // `|`
            case Chars.VerticalBar:
                maybeQuantifier = false;
                break;

                // `^`, `$`, `.`
            case Chars.Caret:
            case Chars.Period:
            case Chars.Dollar:
                maybeQuantifier = true;
                break;

            // `\`
            case Chars.Backslash:

                maybeQuantifier = true;

                if (parser.index >= parser.length) {
                    state = RegexpState.Invalid;
                } else {
                    // Atom ::
                    //   \ AtomEscape
                    if (consumeOpt(parser, Chars.LowerB) || consumeOpt(parser, Chars.UpperB)) {
                        maybeQuantifier = false;
                    } else {
                        state = setValidationState(state, validateAtomEscape(parser));
                    }
                }
                break;

            // `(`
            case Chars.LeftParen:

                let ch = parser.source.charCodeAt(parser.index);
                if (ch === Chars.QuestionMark) {
                    parser.index++; parser.column++;
                    ch = parser.source.charCodeAt(parser.index);
                    if (ch === Chars.Colon || ch === Chars.EqualSign || ch === Chars.Exclamation) {
                        parser.index++; parser.column++;
                    } else state = RegexpState.Invalid; // Invalid group
                } else {
                    ++parser.capturingParens;
                }

                maybeQuantifier = true;
                state = setValidationState(state, validateRegexBody(parser, context, depth + 1, RegexpState.Valid));
                break;

             // `)`
            case Chars.RightParen:
                if (depth > 0) return state;
                state = RegexpState.SloppyMode;
                maybeQuantifier = true;
                break;

            // `[`
            case Chars.LeftBracket:
                state = setValidationState(state, validateCharacterClass(parser));
                maybeQuantifier = true;
                break;

            // `]`
            case Chars.RightBracket:
                state = RegexpState.SloppyMode;
                maybeQuantifier = true;
                break;

            // `?`, `*`, `+`
            case Chars.Asterisk:
            case Chars.Plus:
            case Chars.QuestionMark:
                if (maybeQuantifier) {
                    maybeQuantifier = false;
                    if (parser.index < parser.length) {
                        consumeOpt(parser, Chars.QuestionMark);
                    }
                } else {
                    state = RegexpState.Invalid;
                }
                break;

            // `{`
            case Chars.LeftBrace:

                if (maybeQuantifier) {
                    // Missing the first digits - '/a{,15}/u' - results in,
                    // Incomplete quantifier without the 'u-flag'
                    let res: number | boolean = validateQuantifierPrefix(parser);
                    if ((res as number) & RegexpState.MissingDigits) {
                        res = (res as number) ^ RegexpState.MissingDigits;
                        state = res ? RegexpState.SloppyMode : RegexpState.Invalid;
                    } else if (!res) {
                        // Nothing to repeat
                        state = RegexpState.Invalid;
                    }
                    if (parser.index < parser.length && parser.source.charCodeAt(parser.index) === Chars.QuestionMark) {
                        parser.index++;
                        parser.column++;
                    }
                    maybeQuantifier = false;
                } else {
                    state = RegexpState.Invalid;
                }

                break;

            // `}`
            case Chars.RightBrace:
                state = RegexpState.Invalid;
                maybeQuantifier = false;
                break;

            case Chars.CarriageReturn:
            case Chars.LineFeed:
            case Chars.LineSeparator:
            case Chars.ParagraphSeparator:
                return RegexpState.Invalid;
            default:
                maybeQuantifier = true;
        }
    }

    return RegexpState.Invalid;
}

/**
 * Validates atom escape
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AtomEscape)
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape)
 *
 * @param parser Parser object
 */

function validateAtomEscape(parser: Parser): RegexpState {
    // Atom ::
    //   \ AtomEscape

    const next = parser.source.charCodeAt(parser.index++);

    switch (next) {

        // AtomEscape ::
        //   CharacterClassEscape
        //
        // CharacterClassEscape :: one of
        //   d D s S w W
        case Chars.LowerD:
        case Chars.UpperD:
        case Chars.LowerS:
        case Chars.UpperS:
        case Chars.LowerW:
        case Chars.UpperW:

            // ControlEscape :: one of
            //   f n r t v
        case Chars.LowerF:
        case Chars.LowerN:
        case Chars.LowerR:
        case Chars.LowerT:
        case Chars.LowerV:

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
        case Chars.Slash:
        case Chars.VerticalBar:
            return RegexpState.Valid;

            // RegExpUnicodeEscapeSequence[?U]
        case Chars.LowerU:
            if (consumeOpt(parser, Chars.LeftBrace)) {

                // \u{N}
                let ch2 = parser.source.charCodeAt(parser.index);
                let code = toHex(ch2);
                if (code < 0) return RegexpState.Invalid;
                parser.index++;
                ch2 = parser.source.charCodeAt(parser.index);
                while (ch2 !== Chars.RightBrace) {
                    const digit = toHex(ch2);
                    if (digit < 0) return RegexpState.Invalid;
                    code = code * 16 + digit;
                    // Code point out of bounds
                    if (code > Chars.NonBMPMax) return RegexpState.Invalid;
                    parser.index++;
                    ch2 = parser.source.charCodeAt(parser.index);
                }
                parser.index++;
                return RegexpState.UnicodeMode;
            }

            // \uNNNN
            if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index)) < 0) {
                return RegexpState.Invalid;
            }
            if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index++)) < 0) {
                return RegexpState.Invalid;
            }
            // falls through
        case Chars.UpperX:
        case Chars.LowerX:
            if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index++)) < 0) {
                return RegexpState.Invalid;
            }
            if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index++)) < 0) {
                return RegexpState.Invalid;
            }
            return RegexpState.Valid;

        case Chars.LowerC:
            {
                if (parser.index < parser.length) {
                    const letter = parser.source.charCodeAt(parser.index) | 32;
                    if (letter >= Chars.LowerA && letter <= Chars.LowerZ) {
                        parser.index++; parser.column++;
                        return RegexpState.SloppyMode;
                    }
                }

                return RegexpState.Invalid;
            }

        case Chars.Zero:
            const ch = parser.source.charCodeAt(parser.index);
            if (parser.index >= parser.length || ch >= Chars.Zero && ch <= Chars.Nine) {
                return RegexpState.Invalid;
            }

            return RegexpState.Valid;

        case Chars.One:
        case Chars.Two:
        case Chars.Three:
        case Chars.Four:
        case Chars.Five:
        case Chars.Six:
        case Chars.Seven:
        case Chars.Eight:
        case Chars.Nine:
            return parseBackReferenceIndex(parser, next);
        case Chars.CarriageReturn:
        case Chars.LineFeed:
        case Chars.ParagraphSeparator:
        case Chars.LineSeparator:
            return RegexpState.Invalid;
        default:
            if (isFlagStart(next)) return RegexpState.Invalid;
            return RegexpState.SloppyMode;
    }
}

/**
 * Validates character class
 *
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom)
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash)
 * @param parser Parser object
 * @param context Context masks
 */
function validateCharacterClass(parser: Parser): RegexpState {
    if (parser.index >= parser.length) return RegexpState.Invalid;
    consumeOpt(parser, Chars.Caret);
    const next = parser.source.charCodeAt(parser.index);
    return validateClassRanges(parser, next);
}

/**
 * Validates class and character class escape
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-CharacterClassEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-CharacterEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-strict-IdentityEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-strict-CharacterEscape)
 * @see [Link](https://tc39.github.io/ecma262/##prod-ControlEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-strict-CharacterEscape)
 *
 * @param parser Parser object
 */
export function validateClassAndClassCharacterEscape(parser: Parser): RegexpState | Chars {

    switch (parser.source.charCodeAt(parser.index++)) {

        // 'b'
        case Chars.LowerB:
            return RegexpState.InvalidCharClassRange;

            // 'B'
        case Chars.UpperB:
            return Chars.Backspace;

            // CharacterClassEscape :: one of
            //   d D s S w W
        case Chars.UpperD:
        case Chars.LowerD:
        case Chars.UpperS:
        case Chars.LowerS:
        case Chars.UpperW:
        case Chars.LowerW:
            return RegexpState.InvalidCharClassRange;

            // ControlEscape :: one of
            //   f n r t v
        case Chars.LowerF:
            return Chars.FormFeed;
        case Chars.LowerN:
            return Chars.LineFeed;
        case Chars.LowerR:
            return Chars.CarriageReturn;
        case Chars.LowerT:
            return Chars.Tab;
        case Chars.LowerV:
            return Chars.VerticalTab;

            // '/'
        case Chars.Slash:
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
            return parser.source.charCodeAt(parser.index);
            // '-'
        case Chars.Hyphen:
            // Note: 'AnnexB' allows escaping hyphen ('-') in char clas
            return Chars.Hyphen;

        case Chars.LowerU:
            {
                if (consumeOpt(parser, Chars.LeftBrace)) {
                    // \u{N}
                    let ch = parser.source.charCodeAt(parser.index);
                    let code = toHex(ch);
                    if (code < 0) return RegexpState.InvalidCharClass;
                    parser.index++;
                    ch = parser.source.charCodeAt(parser.index);
                    while (ch !== Chars.RightBrace) {
                        const digit = toHex(ch);
                        if (digit < 0) return RegexpState.InvalidCharClass;
                        code = code * 16 + digit;
                        // Code point out of bounds
                        if (code > Chars.NonBMPMax) return RegexpState.InvalidCharClass;
                        parser.index++;
                        ch = parser.source.charCodeAt(parser.index);
                    }
                    parser.index++;
                    return code | RegexpState.InvalidCharClassInSloppy;

                } else {

                    // \uNNNN
                    let codePoint = toHex(parser.source.charCodeAt(parser.index));
                    if (codePoint < 0) return RegexpState.InvalidCharClass;
                    for (let i = 0; i < 3; i++) {
                        parser.index++; parser.column++;
                        const digit = toHex(parser.source.charCodeAt(parser.index));
                        if (digit < 0) return RegexpState.InvalidCharClass;
                        codePoint = codePoint * 16 + digit;
                    }
                    parser.index++; parser.column++;
                    return codePoint;
                }
            }

        case Chars.LowerX:
            {
                if (parser.index >= parser.length - 1) return RegexpState.InvalidCharClass;
                const ch1 = parser.source.charCodeAt(parser.index);
                const hi = toHex(ch1);
                if (hi < 0) return RegexpState.InvalidCharClass;
                parser.index++;
                const ch2 = parser.source.charCodeAt(parser.index);
                const lo = toHex(ch2);
                if (lo < 0) return RegexpState.InvalidCharClass;
                parser.index++;
                return (hi << 4) | lo;
            }

        case Chars.LowerC:

            if (parser.index < parser.length) {
                const ch = parser.source.charCodeAt(parser.index);
                const letter = ch | 32;
                if (letter >= Chars.LowerA && letter <= Chars.LowerZ) {
                    parser.index++; parser.column++;
                    return ch & 0x1F;
                }
            }

            return RegexpState.InvalidCharClass;

            // '0'
        case Chars.Zero:
            {
                // With /u, \0 is interpreted as NUL if not followed by another digit.
                if (parser.index < parser.length) {
                    const next = parser.source.charCodeAt(parser.index);
                    if (!(next >= Chars.Zero && next <= Chars.Nine)) return 0;
                }
                // falls through
            }

        case Chars.One:
        case Chars.Two:
        case Chars.Three:
        case Chars.Four:
        case Chars.Five:
        case Chars.Six:
        case Chars.Seven:
        case Chars.Eight:
        case Chars.Nine:
            // Invalid class escape
            return RegexpState.InvalidCharClass;
        default:
    }

    return RegexpState.InvalidCharClass;
}

/**
 * Validates character class ranges
 *
 * @param parser Parser object
 * @param context Context masks
 */
function validateClassRanges(parser: Parser, ch: number): RegexpState {

    let prevChar = 0;
    let surrogate = 0;
    let leftUnicodeRange = 0;
    let CharacterRange = 0;
    let prevState = ClassRangesState.Empty;
    let subState = RegexpState.Valid;
    let state = ClassRangesState.Empty;
    let count = 0;

    while (parser.index < parser.length) {

        parser.index++;
        parser.column++;

        switch (ch) {

            // `]`
            case Chars.RightBracket:
                {
                    if (state & ClassRangesState.SeenUnicoderange &&
                        prevState & ClassRangesState.IsSurrogateLead &&
                        (leftUnicodeRange === RegexpState.InvalidCharClassRange ||
                            prevChar & RegexpState.InvalidCharClassRange || leftUnicodeRange > prevChar)) {
                        if (subState & RegexpState.UnicodeMode ||
                            subState & RegexpState.Invalid) return RegexpState.Invalid;
                        return RegexpState.SloppyMode;
                    }
                    return subState;
                }

            // `\`
            case Chars.Backslash:
                {
                    ch = validateClassAndClassCharacterEscape(parser);
                    if (ch === RegexpState.InvalidCharClass) {
                        subState = RegexpState.Invalid;
                    } else if (ch & RegexpState.InvalidCharClassInSloppy) {
                        ch = ch ^ RegexpState.InvalidCharClassInSloppy;
                        if (ch === RegexpState.InvalidCharClass) subState = RegexpState.Invalid;
                        else if (subState & RegexpState.Valid) subState = RegexpState.UnicodeMode;
                        else if (subState & RegexpState.SloppyMode) subState = RegexpState.Invalid;
                    }
                }
        }

        if (prevState & ClassRangesState.IsSurrogateLead && (ch & 0xFC00) === 0xDC00) {
            state = state & ~ClassRangesState.IsSurrogateLead | ClassRangesState.IsTrailSurrogate;
            surrogate = (prevChar - Chars.LeadSurrogateMin) * 0x400 + (ch - Chars.TrailSurrogateMin) + Chars.NonBMPMin;
        } else if (!(prevState & ClassRangesState.IsTrailSurrogate) && prevState & ClassRangesState.IsSurrogateLead && (ch & 0x1FFFFF) > 0xFFFF) {
            state = state & ~ClassRangesState.IsSurrogateLead | ClassRangesState.IsTrailSurrogate;
            surrogate = ch;
        } else {
            state = state & ~(ClassRangesState.IsTrailSurrogate | ClassRangesState.IsSurrogateLead);
            if ((ch & 0xFC00) === Chars.LeadSurrogateMin) state = state | ClassRangesState.IsSurrogateLead;
        }

        if (state & ClassRangesState.SeenUnicoderange) {
            const rightUnicodeRange = state & ClassRangesState.IsTrailSurrogate ? surrogate : prevState & ClassRangesState.IsSurrogateLead ? prevChar : ch;
            if (!(state & ClassRangesState.IsSurrogateLead) ||
                  prevState & ClassRangesState.IsSurrogateLead) {
                state = state & ~ClassRangesState.SeenUnicoderange;
                if (leftUnicodeRange === RegexpState.InvalidCharClassRange ||
                    rightUnicodeRange === RegexpState.InvalidCharClassRange ||
                    leftUnicodeRange > rightUnicodeRange) {
                  if (subState === RegexpState.UnicodeMode) subState = RegexpState.Invalid;
                  else if (subState !== RegexpState.Invalid) subState = RegexpState.SloppyMode;
              }
            }
        } else if (ch === Chars.Hyphen && count > 0) {
            state = state | ClassRangesState.SeenUnicoderange;
        } else {
            leftUnicodeRange = state & ClassRangesState.IsTrailSurrogate ? surrogate : ch;
        }

        if (state & ClassRangesState.InCharacterRange) {
            state = state & ~ClassRangesState.InCharacterRange;
            if (CharacterRange === RegexpState.InvalidCharClassRange ||
                ch === RegexpState.InvalidCharClassRange ||
                CharacterRange > ch) {
              if (subState === RegexpState.SloppyMode) subState = RegexpState.Invalid;
              else if (subState !== RegexpState.Invalid) subState = RegexpState.UnicodeMode;
          }
        } else if (ch === Chars.Hyphen && count > 0) {
            state = state | ClassRangesState.InCharacterRange;
        } else {
            CharacterRange = ch;
        }

        prevState = state;
        prevChar = ch = parser.source.charCodeAt(parser.index);
        count++;
    }
    return RegexpState.Invalid;
}
