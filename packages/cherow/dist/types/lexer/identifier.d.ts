import { Parser } from '../types';
import { Chars } from '../chars';
import { Token } from '../token';
export declare const isIdentifierPart: (code: Chars) => boolean;
export declare function scanIdentifier(parser: Parser): Token;
