import { Parser } from '../types';
import { Chars } from '../chars';
import { Context } from '../common';
import { Token } from '../token';
import { Errors, recordErrors } from '../errors';
import { validateRegexBody } from '../runtime/regexp';
import { setRegExpState, RegexpState, RegExpFlags, isFlagStart } from '../runtime/common';

/**
 * Scans regular expression pattern
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 */
export function scanRegularExpression(parser: Parser, context: Context): Token {

    const { flags, pattern} = verifyRegExpPattern(parser, context);
    parser.tokenRegExp = { pattern, flags };

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
    const flagState = scanRegexFlags(parser, context);
    const flags = parser.source.slice(flagStart, parser.index);
    const pattern = parser.source.slice(bodyStart, bodyEnd);
    const state = setRegExpState(parser, flagState, bodyState);
    return { flags, pattern, state };
}

/**
 * Scan regular expression flags
 *
 * @param parser Parser object
 * @param context Context masks
 */
function scanRegexFlags(parser: Parser, context: Context): RegexpState {

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
            parser.index++;
            parser.column++;
        }

    return mask & RegExpFlags.Unicode ? RegexpState.UnicodeMode : RegexpState.SloppyMode;
}
