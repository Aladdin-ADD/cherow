import { Parser } from '../types';
import { Chars } from '../chars';
import { Token, tokenDesc } from '../token';
import { Context, Flags } from '../common';
import { consumeOpt, toHex } from './common';
import { Errors, recordErrors } from '../errors';

/**
 *  Scans numeric literal
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanNumeric(parser: Parser): Token {
    const { index } = parser;
    let ch = skipDigits(parser);
    if (ch === Chars.Period) {
        parser.index++; parser.column++;
        ch = skipDigits(parser);
    }
    if (ch === Chars.LowerE || ch === Chars.UpperE) {
        parser.index++; parser.column++;
        scanSignedInteger(parser);
    }
    parser.tokenValue = parseFloat(parser.source.slice(index, parser.index));
    return Token.NumericLiteral;
}

/**
 * Scans floating number
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseFractionalNumber(parser: Parser): Token {
    const { index } = parser;
    parser.index++;

    const ch = skipDigits(parser);
    // scan exponent
    if (ch === Chars.LowerE || ch === Chars.UpperE) {
        parser.index++; parser.column++;
        scanSignedInteger(parser);
    }

    parser.tokenValue = parseFloat(parser.source.slice(index, parser.index));
    return Token.NumericLiteral;
}

/**
 * Skips digits
 *
 * @param parser Parser object
 */
function skipDigits(parser: Parser): number {
    let ch = parser.source.charCodeAt(parser.index);
    while (ch >= Chars.Zero && ch <= Chars.Nine) {
        parser.index++; parser.column++;
        ch = parser.source.charCodeAt(parser.index);
    }
    return ch;
}

/**
 * Scans signed integer
 *
 * @param parser Parser object
 */
function scanSignedInteger(parser: Parser): void {
    let ch = parser.source.charCodeAt(parser.index);
    if (ch === Chars.Plus || ch === Chars.Hyphen) {
        parser.index++; parser.column++;
        ch = parser.source.charCodeAt(parser.index);
    }
    skipDigits(parser);
}

export function parseLeadingZero(parser: Parser, context: Context): Token {
    const index = parser.index + 1;
    if (index < parser.source.length) {
        const next = parser.source.charCodeAt(index);
        if (next >= Chars.Zero && next <= Chars.Seven) {
            return scanImplicitOctalDigits(parser, context);
        }
        switch (next) {
            case Chars.LowerX:
            case Chars.UpperX:
                parser.index++;
                return scanHexDigits(parser, context);
            case Chars.LowerB:
            case Chars.UpperB:
                parser.index++;
                return scanBinaryDigits(parser, context);
            case Chars.LowerO:
            case Chars.UpperO:
                parser.index++;
                return scanOctalDigits(parser, context);
            default:
        }
    }
    return scanNumeric(parser);
}

export function scanOctalDigits(parser: Parser, context: Context): Token {
    parser.index++; parser.column++;
    let value = 0;
    let digits = 0;
    let code = parser.source.charCodeAt(parser.index);
    while (parser.index < parser.length) {
        if (!(code >= Chars.Zero && code <= Chars.Seven)) {
            break;
        }
        value = value * 8 + (code - Chars.Zero);
        parser.index++;
        parser.column++;
        code = parser.source.charCodeAt(parser.index);
        digits++;
    }

    if (digits === 0) {
        recordErrors(parser, context, Errors.InvalidOrUnexpectedToken);
    }
    parser.tokenValue = value;
    if (consumeOpt(parser, Chars.LowerN)) return Token.BigInt;
    return Token.NumericLiteral;
}

export function scanHexDigits(parser: Parser, context: Context): Token {
    parser.index++; parser.column++;
    let value = toHex(parser.source.charCodeAt(parser.index));
    if (value < 0) recordErrors(parser, context, Errors.Unexpected);
    parser.index++;
    parser.column++;
    while (parser.index < parser.length) {
        const next = parser.source.charCodeAt(parser.index);
        const digit = toHex(next);
        if (digit < 0) {
            break;
        }
        value = value * 16 + digit;
        parser.index++; parser.column++;
    }
    parser.tokenValue = value;
    if (consumeOpt(parser, Chars.LowerN)) return Token.BigInt;
    return Token.NumericLiteral;
}

/**
 * Scans binary digits
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanBinaryDigits(parser: Parser, context: Context): Token {
    parser.index++; parser.column++;
    let value = 0;
    let digits = 0;
    while (parser.index < parser.length) {
        const code = parser.source.charCodeAt(parser.index);
        value = value * 2 + code - Chars.Zero;
        parser.index++; parser.column++;
        digits++;
    }

    if (digits === 0) recordErrors(parser, context, Errors.InvalidOrUnexpectedToken);
    parser.tokenValue = value;
    if (consumeOpt(parser, Chars.LowerN)) return Token.BigInt;
    return Token.NumericLiteral;
}

/**
 * Scans implicit octals
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function scanImplicitOctalDigits(parser: Parser, context: Context): Token {
    if (context & Context.Strict) recordErrors(parser, context, Errors.Unexpected);
    let next = parser.source.charCodeAt(parser.index);

    let value = 0;
    let index = parser.index;
    let column = parser.column;
    let digits = 0;

    parser.flags |= Flags.HasOctal;

    // Implicit octal, unless there is a non-octal digit.
    // (Annex B.1.1 on Numeric Literals)
    while (index < parser.length) {
        next = parser.source.charCodeAt(index);
        if (next === Chars.Eight || next === Chars.Nine) return scanNumeric(parser);
        if (!(next >= Chars.Zero && next <= Chars.Seven)) break;
        value = value * 8 + (next - Chars.Zero);
        index++;
        column++;
        digits++;
    }
    if (digits === 0) recordErrors(parser, context, Errors.Unexpected);
    parser.tokenValue = value;
    parser.index = index;
    parser.column = column;
    if (consumeOpt(parser, Chars.LowerN)) return Token.BigInt;
    return Token.NumericLiteral;
}