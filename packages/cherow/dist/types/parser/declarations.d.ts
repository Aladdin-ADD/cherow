import { Parser } from '../types';
import * as ESTree from '../estree';
import { Context, BindingType, BindingOrigin, ModifierState } from '../common';
/**
 * Parses class declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseClassDeclaration(parser: Parser, context: Context): any;
/**
 * Parses function declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseFunctionDeclaration(parser: Parser, context: Context, state?: ModifierState): ESTree.FunctionDeclaration;
/**
 * VariableDeclaration :
 *   BindingIdentifier Initializeropt
 *   BindingPattern Initializer
 *
 * VariableDeclarationNoIn :
 *   BindingIdentifier InitializerNoInopt
 *   BindingPattern InitializerNoIn
 *
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseVariableDeclaration(id: any, init: any): ESTree.VariableDeclarator;
export declare function parseVariableDeclarationList(parser: Parser, context: Context, type: BindingType, origin: BindingOrigin): any;
