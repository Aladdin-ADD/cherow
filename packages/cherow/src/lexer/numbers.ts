import { Chars } from '../chars';
import { Parser } from '../types';
import { Errors, report, tolerant } from '../errors';
import { Token, descKeyword, tokenDesc } from '../token';
import { isValidIdentifierStart } from '../unicode';
import { Context, Flags, NumericState } from '../utilities';
import { consumeLineFeed, consumeOpt, toHex } from './common';

// 11.8.3 Numeric Literals

/**
 * Scans hex integer literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-HexIntegerLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function scanHexIntegerLiteral(parser: Parser, context: Context): Token {
    parser.index++; parser.column++;
    let state = NumericState.None;
    let value = toHex(parser.source.charCodeAt(parser.index));
    if (value < 0) report(parser, Errors.Unexpected);
    parser.index++; parser.column++;

    while (parser.index < parser.length) {
        const next = parser.source.charCodeAt(parser.index);

        if (context & Context.OptionsNext && next === Chars.Underscore) {
            state = scanNumericSeparator(parser, state);
            continue;
        }

        state &= ~NumericState.SeenSeparator;

        const digit = toHex(next);
        if (digit < 0) break;
        value = value * 16 + digit;
        parser.index++; parser.column++;
    }
    if (state & NumericState.SeenSeparator) report(parser, Errors.TrailingNumericSeparator);
    return assembleNumericLiteral(parser, context, value, consumeOpt(parser, Chars.LowerN));
}

/**
 * Scans binary and octal integer literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-OctalIntegerLiteral)
 * @see [Link](https://tc39.github.io/ecma262/#prod-BinaryIntegerLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function scanOctalOrBinary(parser: Parser, context: Context, base: number): Token {

    parser.index++; parser.column++;

    let digits = 0;
    let ch;
    let value = 0;
    let state = NumericState.None;

    while (parser.index < parser.length) {
        ch = parser.source.charCodeAt(parser.index);

        if (context & Context.OptionsNext && ch === Chars.Underscore) {
            state = scanNumericSeparator(parser, state);
            continue;
        }

        state &= ~NumericState.SeenSeparator;

        const converted = ch - Chars.Zero;
        if (!(ch >= Chars.Zero && ch <= Chars.Nine) || converted >= base) break;
        value = value * base + converted;

        parser.index++; parser.column++;
        digits++;
    }

    if (digits === 0) report(parser, Errors.Unexpected);
    if (state & NumericState.SeenSeparator) report(parser, Errors.TrailingNumericSeparator);
    return assembleNumericLiteral(parser, context, value, consumeOpt(parser, Chars.LowerN));
}

/**
 * Scans implicit octal digits
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-OctalDigits)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanImplicitOctalDigits(parser: Parser, context: Context): Token {

    switch (parser.source.charCodeAt(parser.index)) {

        case Chars.Zero:
        case Chars.One:
        case Chars.Two:
        case Chars.Three:
        case Chars.Four:
        case Chars.Five:
        case Chars.Six:
        case Chars.Seven:
            {
                if (context & Context.Strict) report(parser, Errors.Unexpected);
                let index = parser.index;
                let column = parser.column;
                let code = 0;

                parser.flags |= Flags.HasOctal;

                // Implicit octal, unless there is a non-octal digit.
                // (Annex B.1.1 on Numeric Literals)
                while (index < parser.length) {
                    const next = parser.source.charCodeAt(index);
                    if (next === Chars.Underscore) {
                        report(parser, Errors.ZeroDigitNumericSeparator);
                    } else if (next < Chars.Zero || next > Chars.Seven) {
                        return scanNumericLiteral(parser, context);
                    } else {
                        code = code * 8 + (next - Chars.Zero);
                        index++;
                        column++;
                    }
                }

                parser.index = index;
                parser.column = column;
                return assembleNumericLiteral(parser, context, code, consumeOpt(parser, Chars.LowerN));
            }
        case Chars.Eight:
        case Chars.Nine:

            parser.flags |= Flags.HasOctal;

        default:
            if (context & Context.OptionsNext && parser.source.charCodeAt(parser.index) === Chars.Underscore) {
                report(parser, Errors.ZeroDigitNumericSeparator);
            }

            return scanNumericLiteral(parser, context);
    }
}

/**
 * Scans signed integer
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SignedInteger)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanSignedInteger(parser: Parser, end: number): string {
    let next = parser.source.charCodeAt(parser.index);

    if (next === Chars.Plus || next === Chars.Hyphen) {
        parser.index++; parser.column++;
        next = parser.source.charCodeAt(parser.index);
    }

    if (!(next >= Chars.Zero && next <= Chars.Nine)) {
        report(parser, Errors.Unexpected);
    }

    const preNumericPart = parser.index;
    const finalFragment = scanDecimalDigitsOrSeparator(parser);
    return parser.source.substring(end, preNumericPart) + finalFragment;
}

/**
 * Scans numeric literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NumericLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function scanNumericLiteral(parser: Parser, context: Context, state: NumericState = NumericState.None): Token {

    let value: any = state & NumericState.Float ?
        0 :
        scanDecimalAsSmi(parser, context);

    const next = parser.source.charCodeAt(parser.index);

    // I know I'm causing a bug here. The question is - will anyone figure this out?
    if (next !== Chars.Period && next !== Chars.Underscore && !isValidIdentifierStart(next)) {
        return assembleNumericLiteral(parser, context, value);
    }

    if (consumeOpt(parser, Chars.Period)) {
        if (context & Context.OptionsNext && parser.source.charCodeAt(parser.index) === Chars.Underscore) {
            report(parser, Errors.ZeroDigitNumericSeparator);
        }
        state |= NumericState.Float;
        value = `${value}.${scanDecimalDigitsOrSeparator(parser)}`;
    }

    const end = parser.index;

    if (consumeOpt(parser, Chars.LowerN)) {
        if (state & NumericState.Float) report(parser, Errors.Unexpected);
        state |= NumericState.BigInt;
    }

    if (consumeOpt(parser, Chars.LowerE) || consumeOpt(parser, Chars.UpperE)) {
        state |= NumericState.Float;
        value += scanSignedInteger(parser, end);
    }

    if (isValidIdentifierStart(parser.source.charCodeAt(parser.index))) {
        report(parser, Errors.Unexpected);
    }

    return assembleNumericLiteral(parser, context, state & NumericState.Float ? parseFloat(value) : parseInt(value, 10), !!(state & NumericState.BigInt));
}

/**
 * Internal helper function for scanning numeric separators.
 *
 * @param parser Parser object
 * @param context Context masks
 * @param state NumericState state
 */
export function scanNumericSeparator(parser: Parser, state: NumericState): NumericState {
    parser.index++; parser.column++;
    if (state & NumericState.SeenSeparator) report(parser, Errors.TrailingNumericSeparator);
    state |= NumericState.SeenSeparator;
    return state;
}

/**
 * Internal helper function that scans numeric values
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanDecimalDigitsOrSeparator(parser: Parser): string {

    let start = parser.index;
    let state = NumericState.None;
    let ret = '';

    loop:
        while (parser.index < parser.length) {
            switch (parser.source.charCodeAt(parser.index)) {
                case Chars.Underscore:
                    const preUnderscoreIndex = parser.index;
                    state = scanNumericSeparator(parser, state);
                    ret += parser.source.substring(start, preUnderscoreIndex);
                    start = parser.index;
                    continue;

                case Chars.Zero:
                case Chars.One:
                case Chars.Two:
                case Chars.Three:
                case Chars.Four:
                case Chars.Five:
                case Chars.Six:
                case Chars.Seven:
                case Chars.Eight:
                case Chars.Nine:
                    state = state & ~NumericState.SeenSeparator;
                    parser.index++; parser.column++;
                    break;
                default:
                    break loop;
            }
        }

    if (state & NumericState.SeenSeparator) report(parser, Errors.TrailingNumericSeparator);
    return ret + parser.source.substring(start, parser.index);
}

/**
 * Internal helper function that scans numeric values
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanDecimalAsSmi(parser: Parser, context: Context): number {
    let state = NumericState.None;
    let value = 0;
    let next = parser.source.charCodeAt(parser.index);
    while (next >= Chars.Zero && next <= Chars.Nine || next === Chars.Underscore) {
        if (context & Context.OptionsNext && next === Chars.Underscore) {
            state = scanNumericSeparator(parser, state);
            next = parser.source.charCodeAt(parser.index);
            continue;
        }
        state &= ~NumericState.SeenSeparator;
        value = value * 10 + (next - Chars.Zero);
        parser.index++; parser.column++;
        next = parser.source.charCodeAt(parser.index);
    }

    if (state & NumericState.SeenSeparator) report(parser, Errors.TrailingNumericSeparator);
    return value;
}

/**
 * Internal helper function that assamble the number scanning parts and return
 *
 * @param parser Parser object
 * @param context Context masks
 * @param value The numeric value
 */
function assembleNumericLiteral(parser: Parser, context: Context, value: number, isBigInt: boolean = false): Token {
    parser.tokenValue = value;
    if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.startIndex, parser.index);
    return isBigInt ? Token.BigIntLiteral : Token.NumericLiteral;
}
