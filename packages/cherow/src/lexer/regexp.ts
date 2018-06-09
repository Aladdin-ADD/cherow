import { Parser } from '../types';
import { Chars } from '../chars';
import { Context, Flags } from '../common';
import { setRegExpState, setValidationState, consumeOpt, RegexpState, toHex, RegExpFlags, isFlagStart } from './common';
import { Token } from '../token';
import { Errors, recordErrors } from '../errors';

/**
 * Scans regular expression pattern
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 */
export function scanRegularExpression(parser: Parser, context: Context): Token {

    const { flags, pattern } = verifyRegExpPattern(parser, context);

    parser.tokenRegExp = {
        pattern,
        flags
    };

    if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.startIndex, parser.index);

    try {
        parser.tokenValue = new RegExp(pattern, flags);
    } catch (e) {
        parser.tokenValue = null;
    }

    return Token.RegularExpression;
}

/**
 * Validates regular expression pattern
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 */

export function verifyRegExpPattern(parser: Parser, context: Context): {
    flags: string; pattern: string; state: RegexpState;
} {
    const bodyStart = parser.index;
    const bodyState = validateRegexBody(parser, context, 0, RegexpState.Valid);
    const bodyEnd = parser.index - 1;
    const { index: flagStart } = parser;
    const flagState = parseRegexFlags(parser, context);
    const flags = parser.source.slice(flagStart, parser.index);
    const pattern = parser.source.slice(bodyStart, bodyEnd);
    const state = setRegExpState(parser, flagState, bodyState);
    return { flags, pattern, state };
}

/**
 * Validate the regular expression body
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 * @param level
 * @param state Validation state
 */
function validateRegexBody(parser: Parser, context: Context, level: number, state: RegexpState): RegexpState {

    let maybeQuantifier = false;

    while (parser.index !== parser.length) {

        switch (parser.source.charCodeAt(parser.index++)) {

            case Chars.Slash:
                if (level !== 0) return RegexpState.Invalid;
                return state;

            case Chars.VerticalBar:
                maybeQuantifier = false;
                break;

            case Chars.Caret:
            case Chars.Period:
            case Chars.Dollar:
                maybeQuantifier = true;
                break;

            case Chars.Backslash:

                maybeQuantifier = true;

                if (parser.index >= parser.length) {
                    state = RegexpState.Invalid;
                } else {
                    if (consumeOpt(parser, Chars.LowerB) || consumeOpt(parser, Chars.UpperB)) {
                        maybeQuantifier = false;
                    } else {
                        const next = parser.source.charCodeAt(parser.index++);
                        state = setValidationState(state, parseRegexAtomEscape(parser, next));
                    }
                }
                break;

            case Chars.LeftParen:

                if (parser.index >= parser.length) return RegexpState.Invalid;

                maybeQuantifier = false; // useless. just in case

                if (consumeOpt(parser, Chars.QuestionMark)) {

                    if (parser.index >= parser.length) {
                        state = RegexpState.Invalid;
                        break;
                    }

                    const ch = parser.source.charCodeAt(parser.index);

                    if (ch === Chars.Colon || ch === Chars.EqualSign || ch === Chars.Exclamation) {
                        parser.index++;
                        if (parser.index >= parser.length) {
                            state = RegexpState.Invalid;
                            break;
                        }

                    } else {
                        state = RegexpState.Invalid;
                    }
                } else {
                    ++parser.capturingParens;
                }

                maybeQuantifier = true;
                state = setValidationState(state, validateRegexBody(parser, context, level + 1, RegexpState.Valid));
                break;

            case Chars.RightParen:

                if (level > 0) return state;
                state = RegexpState.Invalid;
                maybeQuantifier = true;
                break;

            case Chars.LeftBracket:
                state = setValidationState(state, validateCharacterClass(parser));
                maybeQuantifier = true;
                break;
            case Chars.RightBracket:

                state = RegexpState.Invalid;
                maybeQuantifier = true;
                break;

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

            case Chars.LeftBrace:

                if (maybeQuantifier) {
                    if (!parseRegexCurlyQuantifier(parser)) {
                        state = RegexpState.Invalid;
                    }
                    if (parser.index < parser.length) {
                        consumeOpt(parser, Chars.QuestionMark);
                    }
                    maybeQuantifier = false;
                } else {
                    state = RegexpState.Invalid;
                }
                break;
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
 *
 * @param parser Parser object
 * @param code Code point
 */
function parseRegexAtomEscape(parser: Parser, next: number): RegexpState {

    switch (next) {

        case Chars.LowerF:
        case Chars.LowerN:
        case Chars.LowerR:
        case Chars.LowerT:
        case Chars.LowerV:
        case Chars.LowerD:
        case Chars.UpperD:
        case Chars.LowerS:
        case Chars.UpperS:
        case Chars.LowerW:
        case Chars.UpperW:
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
        return validateUnicodeEscape(parser);

    case Chars.UpperX:
    case Chars.LowerX:
        if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index++)) < 0) return RegexpState.Invalid;
        if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index++)) < 0) return RegexpState.Invalid;
        return RegexpState.Valid;

    case Chars.LowerC: {
        next = parser.source.charCodeAt(parser.index);
        if (parser.index >= parser.length  || !isAsciiLetter(next))  return RegexpState.Invalid;
        consumeOpt(parser, next);
        return RegexpState.Valid;
    }
            // digits
        case Chars.Zero:
        const ch = parser.source.charCodeAt(parser.index);
        if (parser.index >= parser.length || ch >= Chars.Zero && ch <= Chars.Nine) {
            return RegexpState.Invalid;
        }; 

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

            if (isIdentRestChr(next)) return RegexpState.Invalid;
            return RegexpState.MaybeBothModes;
    }
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
            parser.index++;
        } else {
            break;
        }
    }

    parser.largestBackReference = value;
    return RegexpState.Valid;
}

/**
 * Validates unicode escape
 *
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape)
 *
 * @param parser Parser object
 * @param code Code point
 */
function validateUnicodeEscape(parser: Parser): RegexpState {

    if (parser.index >= parser.length) return RegexpState.InvalidClassEscape;

    if (consumeOpt(parser, Chars.LeftBrace)) {

         // \u{N}
         let ch = parser.source.charCodeAt(parser.index);
         let code = toHex(ch);
         if (code < 0) return RegexpState.Invalid;
         parser.index++;
         ch = parser.source.charCodeAt(parser.index);
         while (ch !== Chars.RightBrace) {
             const digit = toHex(ch);
             if (digit < 0) return RegexpState.Invalid;
             code = code * 16 + digit;
             // Code point out of bounds
             if (code > Chars.NonBMPMax) return RegexpState.Invalid;
             parser.index++;
             ch = parser.source.charCodeAt(parser.index);
         }
         parser.index++;
         return RegexpState.UnicodeMode;
    } else {

        if (parser.index >= parser.length - 3) return RegexpState.Invalid;
        // \uNNNN
        let codePoint = toHex(parser.source.charCodeAt(parser.index));
        if (codePoint < 0) return RegexpState.Invalid;
        for (let i = 0; i < 3; i++) {
            parser.index++;
            parser.column++;
            const digit = toHex(parser.source.charCodeAt(parser.index));
            if (digit < 0) return RegexpState.Invalid;
            codePoint = codePoint * 16 + digit;
        }
        parser.index++;
        parser.column++;
        return RegexpState.Valid;
    }
}


/**
 * Validates character class
 *
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function validateCharacterClass(parser: Parser): RegexpState {
    if (parser.index >= parser.length) return RegexpState.Invalid;
    consumeOpt(parser, Chars.Caret);
    const next = parser.source.charCodeAt(parser.index);
    // if (parser.index >= parser.length) return RegexpState.Invalid;
    return validateClassRanges(parser, next);
}

    export const enum ClassRangesState {
        Empty = 0,
        IsTrailSurrogate = 1 << 0,
        IsSurrogateLead = 1 << 2,
        SeenUnicoderange = 1 << 8,
        SeenLHSRange = 1 << 10,
    }

function validateClassRanges(parser: Parser, c: number): RegexpState {

    let prev = 0;
    let surrogate = 0;
    let seenTrailSurrogate = true;
    let seenLeadSurrogate = false;
    let lhsUnicodeRange = 0;
    let lhsRange = 0;

    let flagState = RegexpState.Valid;
    let state = ClassRangesState.Empty;
    let n = 0;
    while (true) {

        if (consumeOpt(parser, Chars.RightBracket)) {

            if (state & ClassRangesState.SeenUnicoderange && seenLeadSurrogate && (lhsUnicodeRange === RegexpState.InvalidCharClassRange || prev === RegexpState.InvalidCharClassRange || lhsUnicodeRange > prev)) {
                if (flagState === RegexpState.UnicodeMode) return RegexpState.Invalid;
                if (flagState === RegexpState.Invalid) return RegexpState.Invalid;
                return RegexpState.MaybeBothModes;
            }
            return flagState;
        } else if (c === Chars.Backslash) {
            consumeOpt(parser, Chars.Backslash);
            c = validateCharacterClassEscape(parser);

            if (c === RegexpState.InvalidCharClass) {
                flagState = RegexpState.Invalid;
            } else if (c & RegexpState.InvalidCharClassInSloppy) {
                c = c ^ RegexpState.InvalidCharClassInSloppy;
                if (c === RegexpState.InvalidCharClass) flagState = RegexpState.Invalid;
                else if (flagState === RegexpState.Valid) flagState = RegexpState.UnicodeMode;
                else if (flagState === RegexpState.MaybeBothModes) flagState = RegexpState.Invalid;
            }
        } else if (c === Chars.CarriageReturn || c === Chars.LineFeed || c === Chars.ParagraphSeparator || c === Chars.LineSeparator) {
            return RegexpState.Invalid;
        } else {
            consumeOpt(parser, c);
        }

        if (seenLeadSurrogate && isSurrogateTail(c)) {
            state = state & ~ClassRangesState.IsSurrogateLead | ClassRangesState.IsTrailSurrogate;
            surrogate = getSurrogate(prev, c);
        } else if (!seenTrailSurrogate && !seenLeadSurrogate && (c & 0x1fffff) > 0xffff) { // long unicode escape
            state = state & ~ClassRangesState.IsSurrogateLead | ClassRangesState.IsTrailSurrogate;
            surrogate = c;
        } else {
            state = state & ~(ClassRangesState.IsTrailSurrogate | ClassRangesState.IsSurrogateLead);
            if (isSurrogateLead(c)) state = state | ClassRangesState.IsSurrogateLead;
        }

        if (state & ClassRangesState.SeenUnicoderange) {
            const urangeRight = state & ClassRangesState.IsTrailSurrogate ? surrogate : seenLeadSurrogate ? prev : c;
            if (!(state & ClassRangesState.IsSurrogateLead) || seenLeadSurrogate) {
                state = state & ~ClassRangesState.SeenUnicoderange;
                if (lhsUnicodeRange === RegexpState.InvalidCharClassRange || urangeRight === RegexpState.InvalidCharClassRange || lhsUnicodeRange > urangeRight) {
                    if (flagState === RegexpState.UnicodeMode) flagState = RegexpState.Invalid;
                    else if (flagState !== RegexpState.Invalid) {
                        flagState = RegexpState.MaybeBothModes;
                    }
                }
            }
        } else if (c === Chars.Hyphen && n > 0) {
            state = state | ClassRangesState.SeenUnicoderange;
        } else {
            lhsUnicodeRange = state & ClassRangesState.IsTrailSurrogate ? surrogate : c;
        }

        if (state & ClassRangesState.SeenLHSRange) {
            state = state & ~ClassRangesState.SeenLHSRange;
            if (lhsRange === RegexpState.InvalidCharClassRange || c === RegexpState.InvalidCharClassRange || lhsRange > c) {
                if (flagState === RegexpState.MaybeBothModes) flagState = RegexpState.Invalid;
                else if (flagState !== RegexpState.Invalid) {
                    flagState = RegexpState.UnicodeMode;
                }
            }
        } else if (c === Chars.Hyphen && n > 0) {
            state = state | ClassRangesState.SeenLHSRange;
        } else {
            lhsRange = c;
        }

        seenTrailSurrogate = (state & ClassRangesState.IsTrailSurrogate) === ClassRangesState.IsTrailSurrogate;
        seenLeadSurrogate = (state & ClassRangesState.IsSurrogateLead) === ClassRangesState.IsSurrogateLead;
        prev = c;

        ++n;
        if (parser.index >= parser.length) break;
        c = parser.source.charCodeAt(parser.index);
    }
    return RegexpState.Invalid;
}

function parseRegexFlags(parser: Parser, context: Context) {

    let mask = RegExpFlags.Empty;

    loop:
    while (parser.index < parser.length) {
        const c = parser.source.charCodeAt(parser.index);
        switch (c) {
            case Chars.LowerG:
                if (mask & RegExpFlags.Global) recordErrors(parser, context, Errors.DuplicateRegExpFlag, 'g');
                mask |= RegExpFlags.Global;
                break;
            case Chars.LowerI:
                if (mask & RegExpFlags.IgnoreCase) recordErrors(parser, context, Errors.DuplicateRegExpFlag, 'i');
                mask |= RegExpFlags.IgnoreCase;
                break;
            case Chars.LowerM:
                if (mask & RegExpFlags.Multiline) recordErrors(parser, context, Errors.DuplicateRegExpFlag, 'm');
                mask |= RegExpFlags.Multiline;
                break;
            case Chars.LowerU:
                if (mask & RegExpFlags.Unicode) {
                    recordErrors(parser, context, Errors.DuplicateRegExpFlag, 'u');
                    return RegexpState.Invalid;
                }
                mask |= RegExpFlags.Unicode;
                break;

            case Chars.LowerY:
                if (mask & RegExpFlags.Sticky) recordErrors(parser, context, Errors.DuplicateRegExpFlag, 'y');
                mask |= RegExpFlags.Sticky;
                break;
            case Chars.LowerS:
                if (mask & RegExpFlags.DotAll) recordErrors(parser, context, Errors.DuplicateRegExpFlag, 's');
                mask |= RegExpFlags.DotAll;
                break;
         
            default:
            if (!isFlagStart(c)) break loop;
            return RegexpState.Invalid;
        }
        parser.index++; parser.column++;
    }

    return mask & RegExpFlags.Unicode ? RegexpState.UnicodeMode : RegexpState.MaybeBothModes;
    
}

function parseRegexCurlyQuantifier(parser: Parser) {
    // parsed the curly, verify the range is not {hi,lo}

    // next should be either a comma or a digit
    if (parser.index >= parser.length) return false;
    let hasLow = false;
    let hasHi = false;
    let min = 0;
    let max = 0;
    let c;
    let start = true;
    let badNumber = false;
    do {
        c = parser.source.charCodeAt(parser.index);
        if (!isAsciiNumber(c)) break;
        consumeOpt(parser, c);
        hasLow = true;
        if (start) {
            start = false;
            if (c === Chars.Zero) {
                if (parser.index >= parser.length) return false;
                c = parser.source.charCodeAt(parser.index);
                if (!isAsciiNumber(c)) break;
                badNumber = true;
                consumeOpt(parser, c);
            }
        }
        min = (min * 10) + (c - Chars.Zero);
    } while (parser.index < parser.length);
    if (c === Chars.Comma) {
        consumeOpt(parser, Chars.Comma);
        start = true;
        if (parser.index >= parser.length) return false;
        do {
            c = parser.source.charCodeAt(parser.index);
            if (!isAsciiNumber(c)) break;
            consumeOpt(parser, c);
            hasHi = true;
            if (start) {
                start = false;
                if (c === Chars.Zero) {
                    if (parser.index >= parser.length) return false;
                    c = parser.source.charCodeAt(parser.index);
                    if (!isAsciiNumber(c)) break;
                    badNumber = true;
                    consumeOpt(parser, c);
                }
            }
            max = (max * 10) + (c - Chars.Zero);
        } while (parser.index < parser.length);
    }
    if (c === Chars.RightBrace) {
        consumeOpt(parser, Chars.RightBrace);
        // return (hasLow && (min <= max || !hasHi)) || (!hasLow && hasHi);
        return !badNumber && (hasLow !== hasHi || (hasLow && hasHi && min <= max));
    }
    return false;
}

function isSurrogateLead(c: any) {
    return c >= 0xD800 && c <= 0xDBFF;
}

function isSurrogateTail(c: any) {
    return c >= 0xDC00 && c <= 0xDFFF;
}

function getSurrogate(c1: any, c2: any): any {
    return (c1 - 0xD800) * 0x400 + (c2 - 0xDC00) + 0x10000;
}


function isIdentRestChr(c: any): any {
    if (isAsciiLetter(c)) return true;
    if (isAsciiNumber(c)) return true;
    if (c === Chars.Dollar || c === Chars.Underscore) return true;
    return false;
}

function isAsciiLetter(c: any): any {
    // make upper and lower case the same value (for the sake of the isletter check).
    // only difference between a lower and upper case ascii letter is the 6th bit (=1<<5=32)
    const d = c | 32;
    return d >= Chars.LowerA && d <= Chars.LowerZ;
}

function isAsciiNumber(c: any): any {
    return c >= Chars.Zero && c <= Chars.Nine;
}

export function validateCharacterClassEscape(parser: Parser): RegexpState | Chars {

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
            return Chars.Hyphen | RegexpState.InvalidCharClassInSloppy;


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
                    consumeOpt(parser, Chars.RightBrace)
                    return code | RegexpState.InvalidCharClassInSloppy;

                } else {
                    if (parser.index >= parser.length - 3) return RegexpState.InvalidCharClass;
                    // \uNNNN
                    let codePoint = toHex(parser.source.charCodeAt(parser.index));
                    if (codePoint < 0) return RegexpState.InvalidCharClass;
                    for (let i = 0; i < 3; i++) {
                        parser.index++;
                        parser.column++;
                        const digit = toHex(parser.source.charCodeAt(parser.index));
                        if (digit < 0) return RegexpState.InvalidCharClass;
                        codePoint = codePoint * 16 + digit;
                    }
                    parser.index++;
                    parser.column++;
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
                const letter = ch & ~(Chars.UpperA ^ Chars.LowerA);
                // Control letters mapped to ASCII control characters in the range 0x00-0x1F.
                if (letter >= Chars.UpperA && letter <= Chars.UpperZ) {
                    parser.index++;
                    parser.column++;
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
    }

    return RegexpState.InvalidCharClass;
}