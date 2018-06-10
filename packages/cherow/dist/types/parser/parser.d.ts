import { Context } from '../common';
import { Parser, OnError, Options, OnComment } from '../types';
import * as ESTree from '../estree';
/**
 * Creates the parser object
 *
 * @param source The source coode to parser
 * @param sourceFile Optional source file info to be attached in every node
 */
export declare function createParserObject(source: string, onComment?: OnComment, onError?: OnError): Parser;
/**
 * Creating the parser
 *
 * @param source The source coode to parser
 * @param options The parser options
 * @param context Context masks
 */
export declare function parseSource(source: string, options: Options | void, context: Context): ESTree.Program;
/**
 * Parse either script code or module code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-scripts)
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
export declare function parse(source: string, options?: Options): ESTree.Program;
/**
 * Parse script code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-scripts)
 *
 * @param source source code to parse
 * @param options parser options
 */
export declare function parseScript(source: string, options?: Options): ESTree.Program;
/**
 * Parse module code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
export declare function parseModule(source: string, options?: Options): ESTree.Program;
/**
 * Validate regular expressions
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
export declare function validateRegExp(source: string, options?: Options): boolean;
