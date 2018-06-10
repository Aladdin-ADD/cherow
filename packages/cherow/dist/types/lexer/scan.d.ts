import { Parser } from '../types';
import { Token } from '../token';
import { Context } from '../common';
/**
 *
 * parser Parser object
 * context Context masks
 */
export declare function nextToken(parser: Parser, context: Context): Token;
