import * as ESTree from '../estree';
import { Parser, Location } from '../types';
import { Token } from '../token';
import { Context } from '../utilities';
export declare function parseJSXRootElement(parser: Parser, context: Context): ESTree.JSXElement | ESTree.JSXFragment;
export declare function parseJSXOpeningElement(parser: Parser, context: Context, name: string, attributes: any, selfClosing: boolean, pos: Location): ESTree.JSXOpeningElement;
export declare function nextJSXToken(parser: Parser): Token;
export declare function scanJSXToken(parser: Parser): Token;
export declare function parseJSXText(parser: Parser, context: Context): ESTree.JSXText;
export declare function parseJSXAttributes(parser: Parser, context: Context): any[];
export declare function parseJSXSpreadAttribute(parser: Parser, context: Context): ESTree.JSXSpreadAttribute;
export declare function parseJSXNamespacedName(parser: Parser, context: Context, namespace: ESTree.JSXIdentifier | ESTree.JSXMemberExpression, pos: Location): ESTree.JSXNamespacedName;
export declare function parseJSXAttributeName(parser: Parser, context: Context): ESTree.JSXIdentifier | ESTree.JSXNamespacedName;
export declare function parseJSXAttribute(parser: Parser, context: Context): any;
export declare function parseJSXEmptyExpression(parser: Parser, context: Context): ESTree.JSXEmptyExpression;
export declare function parseJSXSpreadChild(parser: Parser, context: Context): ESTree.JSXSpreadChild;
export declare function parseJSXExpressionContainer(parser: Parser, context: Context): ESTree.JSXExpressionContainer;
export declare function parseJSXExpression(parser: Parser, context: Context): ESTree.JSXExpressionContainer | ESTree.JSXSpreadChild;
export declare function parseJSXClosingFragment(parser: Parser, context: Context): ESTree.JSXClosingFragment;
export declare function parseJSXClosingElement(parser: Parser, context: Context): ESTree.JSXClosingElement;
export declare function parseJSXIdentifier(parser: Parser, context: Context): ESTree.JSXIdentifier;
export declare function parseJSXMemberExpression(parser: Parser, context: Context, expr: any, pos: Location): ESTree.JSXMemberExpression;
export declare function parseJSXElementName(parser: Parser, context: Context): any;
export declare function scanJSXIdentifier(parser: Parser): Token;
