import { Parser } from '../types';
import * as ESTree from '../estree';
import { Context, ModifierState } from '../common';
/**
 * Expression :
 *   AssignmentExpression
 *   Expression , AssignmentExpression
 *
 * ExpressionNoIn :
 *   AssignmentExpressionNoIn
 *   ExpressionNoIn , AssignmentExpressionNoIn
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Expression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseExpression(parser: Parser, context: Context): ESTree.Expression;
/**
 * Parse secuence expression
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseSequenceExpression(parser: Parser, context: Context, left: ESTree.Expression): ESTree.SequenceExpression;
export declare function parseAssignmentExpression(parser: Parser, context: Context): any;
/**
 * Parse left hand side expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-LeftHandSideExpression)
 *
 * @param Parser Parer instance
 * @param Context Contextmasks
 * @param pos Location info
 */
export declare function parseLeftHandSideExpression(parser: Parser, context: Context): any;
/**
 * Parse new or member expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NewExpression)
 * @see [Link](https://tc39.github.io/ecma262/#prod-NewExpression)
 * @see [Link](https://tc39.github.io/ecma262/#prod-MemberExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseNewOrMemberExpression(parser: Parser, context: Context): any;
export declare function parseNewTargetExpression(parser: Parser, context: Context, id: ESTree.Identifier): any;
export declare function parsePrimaryExpression(parser: Parser, context: Context): any;
export declare function parseIdentifier(parser: Parser, context: Context): ESTree.Identifier;
/**
 * Parses string and number literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NumericLiteral)
 * @see [Link](https://tc39.github.io/ecma262/#prod-StringLiteral)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseLiteral(parser: Parser, context: Context): ESTree.Literal;
/**
 * Parses BigInt literal (stage 3 proposal)
 *
 * @see [Link](https://tc39.github.io/proposal-bigint/)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseBigIntLiteral(parser: Parser, context: Context): ESTree.BigIntLiteral;
/**
 * Parses function expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionExpression)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseFunctionExpression(parser: Parser, context: Context, state?: ModifierState): ESTree.FunctionExpression;
/**
 * Parses formal parameters and function body.
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionBody)
 * @see [Link](https://tc39.github.io/ecma262/#prod-FormalParameters)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseFormalListAndBody(parser: Parser, context: Context): any;
/**
 * Parse property name
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-PropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parsePropertyName(parser: Parser, context: Context): any;
/**
 * Parse computed property names
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ComputedPropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseComputedPropertyName(parser: Parser, context: Context): ESTree.Expression;
/**
 * Parses class declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export declare function parseClassExpression(parser: Parser, context: Context): any;
/**
 * Parse class body and element list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassBody)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassElementList)
 *
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseClassBodyAndElementList(parser: Parser, context: Context): ESTree.ClassBody;
/**
 * Parse class element and class public instance fields & private instance fields
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassElement)
 * @see [Link](https://tc39.github.io/proposal-class-public-fields/)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseClassElement(parser: Parser, context: Context): any;
/**
 * Parses object literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ObjectLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export declare function parseObjectLiteral(parser: Parser, context: Context): ESTree.ObjectExpression;
