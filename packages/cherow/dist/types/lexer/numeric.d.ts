import { Parser } from '../types';
import { Token } from '../token';
import { Context } from '../common';
/**
 *  Scans numeric literal
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function scanNumeric(parser: Parser): Token;
/**
 * Scans floating number
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseFractionalNumber(parser: Parser): Token;
export declare function parseLeadingZero(parser: Parser, context: Context): Token;
export declare function scanOctalDigits(parser: Parser, context: Context): Token;
export declare function scanHexDigits(parser: Parser, context: Context): Token;
/**
 * Scans binary digits
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function scanBinaryDigits(parser: Parser, context: Context): Token;
/**
 * Scans implicit octals
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function scanImplicitOctalDigits(parser: Parser, context: Context): Token;
