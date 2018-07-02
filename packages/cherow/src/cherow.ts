import { parse, parseSource, parseModule, parseScript } from './parser/parser';
import { validateRegExp } from './runtime/validateRegExp';
import * as ESTree from './estree';
import * as Scanner from './lexer/index';

export const version = '__VERSION__';

export { ESTree, Scanner, parse, parseSource, parseModule, parseScript, validateRegExp };
export * from './chars';
export * from './errors';
export * from './token';
export * from './types';
export * from './unicode';
export * from './common';
