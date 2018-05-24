import { Context } from '../common';
import { Parser } from '../types';
import * as ESTree from '../estree';
export declare function createParserObject(source: string, errCallback?: any): Parser;
/**
 * Creating the parser
 *
 * @param source The source coode to parser
 * @param options The parser options
 * @param context Context masks
 */
export declare function parseSource(source: string, options: any, context: Context, errCallback?: any): ESTree.Program;
/**
 * Parse either script code or module code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-scripts)
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
export declare function parse(source: string, options?: any, errCallback?: any): ESTree.Program;
/**
 * Parse script code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-scripts)
 *
 * @param source source code to parse
 * @param options parser options
 */
export declare function parseScript(source: string, options?: any, errCallback?: any): ESTree.Program;
/**
 * Parse module code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
export declare function parseModule(source: string, options?: any, errCallback?: any): ESTree.Program;
