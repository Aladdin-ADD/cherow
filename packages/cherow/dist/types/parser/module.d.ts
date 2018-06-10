import * as ESTree from '../estree';
import { Parser } from '../types';
import { Context } from '../common';
export declare function parseModuleItemList(parser: Parser, context: Context): any[];
/**
 * Parse module item
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleItem)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseModuleItem(parser: Parser, context: Context): any;
/**
 * Parse export declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseExportDeclaration(parser: Parser, context: Context): any;
/**
 * Parse import declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseImportDeclaration(parser: Parser, context: Context): ESTree.ImportDeclaration;
