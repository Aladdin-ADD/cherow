import { Options } from './types';
import { ESTree, Parser, Context } from 'cherow';
import { parse } from './parser/parser';
/**
 * Parse TypeScript
 *
 * @param source source code to parse
 * @param options parser options
 */
export function parseTS(source: string, options?: Options): ESTree.Program {
  return options && options.module
    ? parse(source, options, Context.Strict | Context.Module)
    : parse(source, options, Context.Empty);
}
