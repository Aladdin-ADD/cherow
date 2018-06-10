import { Parser } from './types';
import { Context } from './common';
export declare function constructError(index: number, line: number, column: number, description: string): void;
export declare function recordErrors(parser: Parser, context: Context, type: Errors, ...params: string[]): void;
