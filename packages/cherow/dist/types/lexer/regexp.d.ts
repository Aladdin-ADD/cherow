import { Parser } from '../types';
import { Chars } from '../chars';
import { Context } from '../common';
import { Token } from '../token';
import { RegexpState } from './common';
/**
 * Scans regular expression pattern
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 */
export declare function scanRegularExpression(parser: Parser, context: Context): Token;
/**
 * Validates regular expression pattern
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 */
export declare function verifyRegExpPattern(parser: Parser, context: Context): {
    flags: string;
    pattern: string;
    state: RegexpState;
};
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
export declare function validateClassAndClassCharacterEscape(parser: Parser): RegexpState | Chars;
