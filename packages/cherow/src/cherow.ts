import { parseSource } from './parser/parser';
import * as ESTree from './estree';
import * as Scanner from './lexer/index';

export const version = '__VERSION__';

export { ESTree, Scanner, parseSource };
export * from './tokenize/index';