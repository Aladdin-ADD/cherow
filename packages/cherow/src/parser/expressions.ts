import { Parser, Location } from '../types';
import { Token, tokenDesc } from '../token';
import * as ESTree from '../estree';
import { parseAssignmentPattern, parseDelimitedBindingList, parseBindingIdentifier } from './pattern';
import { parseStatementListItem, parseDirective } from './statements';
import { Errors, recordErrors, report, } from '../errors';
import { nextToken } from '../lexer/scan';
import { consumeTemplateBrace } from '../lexer/template';
import { scanRegularExpression } from '../lexer/regexp';
import {
    Context,
    Flags,
    BindingOrigin,
    BindingType,
    ModifierState,
    swapContext,
    consume,
    expect,
    nextTokenIsLeftParen,
    nextTokenIsLeftParenOrKeyword,
    lookahead,
    nextTokenIsArrow,
    reinterpret,
    LabelState,
    nextTokenIsFuncKeywordOnSameLine,
    getUnexpectedTokenMessage,
    isStartOfExpression,
    getLocation,
    finishNode
} from '../common';

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
export function parseExpression(parser: Parser, context: Context): ESTree.Expression {
    const pos = getLocation(parser);
    const expr = parseAssignmentExpression(parser, context);
    if (parser.token !== Token.Comma) return expr;
    return parseSequenceExpression(parser, context, expr, pos);
}

/**
 * Parse secuence expression
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseSequenceExpression(
    parser: Parser,
    context: Context,
    left: ESTree.Expression,
    pos: Location,
): ESTree.SequenceExpression {
    const expressions: ESTree.Expression[] = [left];
    while (consume(parser, context, Token.Comma)) {
        expressions.push(parseAssignmentExpression(parser, context));
    }
    return finishNode(parser, context, pos, {
        type: 'SequenceExpression',
        expressions,
    });
}

export function parseAssignmentExpression(parser: Parser, context: Context): any {
    // AssignmentExpression ::
    //   ConditionalExpression
    //   ArrowFunction
    //   YieldExpression
    //   LeftHandSideExpression AssignmentOperator AssignmentExpression
    const { token } = parser;
    const pos = getLocation(parser);
    if (token === Token.YieldKeyword && context & Context.Yield) return parseYieldExpression(parser, context, pos);

    const isAsync = token === Token.AsyncKeyword /*&& !(parser.flags & Flags.NewLine)*/ &&
        lookahead(parser, context, nextTokenIsLeftParenOrKeyword);
    let left: any = parseConditionalExpression(parser, context, pos);

    if (isAsync && (parser.token & Token.Identifier) === Token.Identifier && lookahead(parser, context, nextTokenIsArrow)) {
        left = [parseIdentifier(parser, context)];
    }

    if (parser.token === Token.Arrow) {
        if ((token & Token.Identifier)) left = [left];
        return parseArrowFunction(parser, context, isAsync ? ModifierState.Async | ModifierState.Arrow : ModifierState.Arrow, pos, left);
    }

    if ((parser.token & Token.IsAssignOp) === Token.IsAssignOp) {
   //     if ((parser.flags & Flags.Assignable) !== Flags.Assignable) recordErrors(parser, context, Errors.InvalidLHSDefaultValue);
        if (parser.token === Token.Assign) {
            if (left.type === 'ArrayExpression' || left.type === 'ObjectExpression') reinterpret(parser, context, left);
        }
        const operator = parser.token;
        nextToken(parser, context);
        const right = parseAssignmentExpression(parser, context);

        return finishNode(parser, context, pos, {
            type: 'AssignmentExpression',
            left: left,
            operator: tokenDesc(operator),
            right,
        });
    }
    return left;
}

function parseYieldExpression(parser: Parser, context: Context, pos: Location): ESTree.YieldExpression {
    expect(parser, context, Token.YieldKeyword);
    let argument: ESTree.Expression | null = null;
    let delegate = false;
    if (!(parser.flags & Flags.NewLine)) {
        delegate = consume(parser, context, Token.Multiply);
        if (delegate || isStartOfExpression(parser)) {
            argument = parseAssignmentExpression(parser, context);
        }
    }
    return finishNode(parser, context, pos, {
            type: 'YieldExpression',
            argument,
            delegate,
       });
}

/**
 * Parse conditional expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ConditionalExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseConditionalExpression(parser: Parser, context: Context, pos: Location): ESTree.Expression | ESTree.ConditionalExpression {
    // ConditionalExpression ::
    // LogicalOrExpression
    // LogicalOrExpression '?' AssignmentExpression ':' AssignmentExpression
    const test = parseBinaryExpression(parser, context, 0, pos);
    if (!consume(parser, context, Token.QuestionMark)) return test;
    const consequent = parseAssignmentExpression(parser, context);
    expect(parser, context, Token.Colon);
    const alternate = parseAssignmentExpression(parser, context);
    return finishNode(parser, context, pos, {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate,
    });
}

/**
 * Parse binary expression.
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-exp-operator)
 * @see [Link](https://tc39.github.io/ecma262/#sec-binary-logical-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-additive-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-bitwise-shift-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-equality-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-binary-logical-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-relational-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-multiplicative-operators)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param minPrec Minimum precedence value
 * @param pos Line / Column info
 * @param Left Left hand side of the binary expression
 */
function parseBinaryExpression(
    parser: Parser,
    context: Context,
    minPrec: number,
    pos: Location,
    left: any = parseUnaryExpression(parser, context),
): ESTree.Expression {

    // Shift-reduce parser for the binary operator part of the JS expression
    // syntax.

    const bit = (context & Context.DisallowIn) === Context.DisallowIn;
    while ((parser.token & Token.IsBinaryOp) === Token.IsBinaryOp) {
        const t: Token = parser.token;
        const prec = t & Token.Precedence;
        const delta = ((t === Token.Exponentiate) as any) << Token.PrecStart;
        if (bit && t === Token.InKeyword) break;
        // When the next token is no longer a binary operator, it's potentially the
        // start of an expression, so we break the loop
        if (prec + delta <= minPrec) break;
        nextToken(parser, context);
        parser.flags &= ~Flags.Assignable;

        left = finishNode(parser, context, pos, {
            type: t & Token.IsLogical ? 'LogicalExpression' : 'BinaryExpression',
            left,
            right: parseBinaryExpression(parser, context, prec, pos),
            operator: tokenDesc(t),
        });
    }

    return left;
}

/**
 * Parse await expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AwaitExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location info
 */
function parseAwaitExpression(parser: Parser, context: Context, pos: Location): ESTree.AwaitExpression {
    if (context & Context.InParameter) recordErrors(parser, context, Errors.Unexpected);
    expect(parser, context, Token.AwaitKeyword);
    return finishNode(parser, context, pos, {
        type: 'AwaitExpression',
        argument: parseUnaryExpression(parser, context),
    });
}

/**
 * Parses unary expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-UnaryExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseUnaryExpression(parser: Parser, context: Context): any {
    // UnaryExpression ::
    //   PostfixExpression
    //   'delete' UnaryExpression
    //   'void' UnaryExpression
    //   'typeof' UnaryExpression
    //   '++' UnaryExpression
    //   '--' UnaryExpression
    //   '+' UnaryExpression
    //   '-' UnaryExpression
    //   '~' UnaryExpression
    //   '!' UnaryExpression
    //   [+Await] AwaitExpression[?Yield]
    const pos = getLocation(parser);
    const { token } = parser;
    if ((token & Token.IsUnaryOp) === Token.IsUnaryOp) {
        nextToken(parser, context);
        const argument: ESTree.Expression = parseUnaryExpression(parser, context);
        return finishNode(parser, context, pos, {
            type: 'UnaryExpression',
            operator: tokenDesc(token),
            argument,
            prefix: true,
        });
    } else if (parser.token === Token.AwaitKeyword
    && ((context & Context.Async) === Context.Async ||
       (context & Context.InFunctionBody) !== Context.InFunctionBody && (context & Context.OptionsExperimental) === Context.OptionsExperimental)

    ) {
        return parseAwaitExpression(parser, context, pos);
    }

    return parseUpdateExpression(parser, context, pos);
}

/**
 * Parses update expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-UpdateExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseUpdateExpression(parser: Parser, context: Context, pos: Location): any {
    // UpdateExpression ::
    //   LeftHandSideExpression ('++' | '--')?
    const { token } = parser;
    if ((parser.token & Token.IsUpdateOp) === Token.IsUpdateOp) {
        nextToken(parser, context);
        const expr = parseLeftHandSideExpression(parser, context, pos);
        return finishNode(parser, context, pos, {
            type: 'UpdateExpression',
            argument: expr,
            operator: tokenDesc(token as Token),
            prefix: true,
        });
    }

    const expression = parseLeftHandSideExpression(parser, context, pos);

    if ((parser.token & Token.IsUpdateOp) === Token.IsUpdateOp && !(parser.flags & Flags.NewLine)) {
        const operator = parser.token;
        nextToken(parser, context);
        return finishNode(parser, context, pos, {
            type: 'UpdateExpression',
            argument: expression,
            operator: tokenDesc(operator as Token),
            prefix: false,
        });
    }

    return expression;
}

/**
 * Parse left hand side expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-LeftHandSideExpression)
 *
 * @param Parser Parer instance
 * @param Context Contextmasks
 * @param pos Location info
 */
export function parseLeftHandSideExpression(parser: Parser, context: Context, pos: Location): any {
    // LeftHandSideExpression ::
    //   (NewExpression | MemberExpression) ...
    let expr = parseNewOrMemberExpression(parser, context, pos);

    while (true) {
        switch (parser.token) {
            case Token.LeftBracket:
                {
                    expect(parser, context, Token.LeftBracket);
                    const property = parseExpression(parser, context);
                    expect(parser, context, Token.RightBracket);
                    expr = finishNode(parser, context, pos, {
                        type: 'MemberExpression',
                        object: expr,
                        computed: true,
                        property,
                    });
                    break;
                }

            case Token.Period:
                {
                    expect(parser, context, Token.Period);
                    const property = parseIdentifier(parser, context);

                    expr = finishNode(parser, context, pos, {
                        type: 'MemberExpression',
                        object: expr,
                        computed: false,
                        property,
                    });
                    break;
                }
            case Token.LeftParen:
                {
                    const args = parseArgumentList(parser, context);
                    if (parser.token === Token.Arrow) {
                        parser.flags |= Flags.SimpleParameterList;
                        return args;
                    }
                    expr = finishNode(parser, context, pos, {
                        type: 'CallExpression',
                        callee: expr,
                        arguments: args,
                    });
                    break;
                }
            case Token.TemplateCont:
                break;
            case Token.TemplateTail:
                break;
            default:
                return expr;
        }
    }
}

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
export function parseNewOrMemberExpression(parser: Parser, context: Context, pos: Location): ESTree.Expression {
    if (parser.token === Token.NewKeyword) {
        let result: any;
        const id = parseIdentifier(parser, context);
        if (parser.token === Token.SuperKeyword) {
            result = parseSuperProperty(parser, context);
        } else if (parser.token === Token.ImportKeyword && lookahead(parser, context, nextTokenIsLeftParen)) {
            recordErrors(parser, context, Errors.Unexpected);
        } else if (consume(parser, context, Token.Period)) {
            result = parseNewTargetExpression(parser, context, id);
            return parseMemberExpressionContinuation(parser, context, result, pos);
        } else {
            result = parseNewOrMemberExpression(parser, context, pos);
        }
        return finishNode(parser, context, pos, {
            type: 'NewExpression',
            callee: result,
            arguments: parser.token === Token.LeftParen ? parseArgumentList(parser, context) : [],
        });
    }
    return parseMemberExpression(parser, context, pos);
}

export function parseNewTargetExpression(parser: Parser, context: Context, id: ESTree.Identifier): any {
    if ((context & Context.NewTarget) === Context.NewTarget && parser.tokenValue === 'target') {
        return parseMetaProperty(parser, context, id);
    }
    recordErrors(parser, context, Errors.UnexpectedNewTarget);
}

/**
 * Parse Import() expressions. (Stage 3 proposal)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location
 */
function parseImportExpressions(parser: Parser, context: Context): ESTree.Expression {
    const pos = getLocation(parser);
    const id = parseIdentifier(parser, context);
    // Import.meta - Stage 3 proposal
    if (consume(parser, context, Token.Period)) {
        if (!(context & Context.Module) || parser.tokenValue !== 'meta') {
            recordErrors(parser, context, Errors.Unexpected);
        }
        return parseMetaProperty(parser, context, id);
    }

    let expr: any = parseImportCall(parser, context);
    expect(parser, context, Token.LeftParen);
    const args = parseAssignmentExpression(parser, context);
    expect(parser, context, Token.RightParen);
    expr = finishNode(parser, context, pos, {
        type: 'CallExpression',
        callee: expr,
        arguments: [args],
    });
    return expr;
}

/**
 * Parse Import() expression. (Stage 3 proposal)
 *
 */
function parseImportCall(parser: Parser, context: Context): ESTree.ImportExpression {
    const pos = getLocation(parser);
    return finishNode(parser, context, pos, {
        type: 'Import',
    });
}

/**
 * Parse member expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-MemberExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location info
 * @param expr Expression
 */

function parseMemberExpression(
    parser: Parser,
    context: Context,
    pos: Location
): ESTree.Expression {
    let result: any;
    if (parser.token === Token.SuperKeyword) {
        result = parseSuperProperty(parser, context);
    } else if (parser.token === Token.ImportKeyword) {
        result = parseImportExpressions(parser, context);
    } else {
        result = parsePrimaryExpression(parser, context);
    }

    return parseMemberExpressionContinuation(parser, context, result, pos);
}

/**
 * Parse member expression continuation
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location info
 * @param expr Expression
 */
function parseMemberExpressionContinuation(parser: Parser, context: Context, expr: any, pos: Location) {
    while (true) {
        switch (parser.token) {
            case Token.LeftBracket:
                {
                    expect(parser, context, Token.LeftBracket);
                    const property = parseExpression(parser, context);
                    expect(parser, context, Token.RightBracket);
                    expr = finishNode(parser, context, pos, {
                        type: 'MemberExpression',
                        object: expr,
                        computed: true,
                        property,
                    });
                    break;
                }

            case Token.Period:
                {
                    expect(parser, context, Token.Period);
                    const property = parseIdentifier(parser, context);

                    expr = finishNode(parser, context, pos, {
                        type: 'MemberExpression',
                        object: expr,
                        computed: false,
                        property,
                    });
                    break;
                }
            case Token.TemplateCont:
                break;
            case Token.TemplateTail:
                break;
            case Token.Invalid:
            default:
                return expr;
        }
    }
}

/**
 * Parse super property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SuperProperty)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseSuperProperty(parser: Parser, context: Context): ESTree.Super {
     // SuperProperty[Yield, Await]:
    //  super[Expression[+In, ?Yield, ?Await]]
    //  super.IdentifierName
    const pos = getLocation(parser);
    expect(parser, context, Token.SuperKeyword);
    switch (parser.token) {
        case Token.LeftParen:
            // The super property has to be within a class constructor
            if (!(context & Context.AllowSuperProperty)) recordErrors(parser, context, Errors.Unexpected);
            break;
        case Token.LeftBracket:
        case Token.Period:
            if (!(context & Context.Method)) recordErrors(parser, context, Errors.Unexpected);
            break;
        default:
        recordErrors(parser, context, Errors.Unexpected);
    }

    return finishNode(parser, context, pos, {
        type: 'Super',
    });
}
/**
 * Parse meta property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementList)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param meta Identifier
 * @param pos Location
 */

function parseMetaProperty(parser: Parser, context: Context, meta: ESTree.Identifier): ESTree.MetaProperty {
    const pos = getLocation(parser);
    return finishNode(parser, context, pos, {
        meta,
        type: 'MetaProperty',
        property: parseIdentifier(parser, context),
    });
}

/**
 * Parse argument list
 *
 * @see [https://tc39.github.io/ecma262/#prod-ArgumentList)
 *
 * @param Parser Parser object
 * @param Context Context masks
 */
function parseArgumentList(parser: Parser, context: Context): (ESTree.Expression | ESTree.SpreadElement)[] {
    // ArgumentList :
    //   AssignmentOrSpreadExpression
    //   ArgumentList , AssignmentOrSpreadExpression
    //
    // AssignmentOrSpreadExpression :
    //   ... AssignmentExpression
    //   AssignmentExpression
    expect(parser, context, Token.LeftParen);
    const expressions: (ESTree.Expression | ESTree.SpreadElement)[] = [];
    while (parser.token !== Token.RightParen) {
        if (parser.token === Token.Ellipsis) {
            expressions.push(parseSpreadElement(parser, context));
        } else {
            expressions.push(parseAssignmentExpression(parser, context));
        }

        if (parser.token !== Token.RightParen) expect(parser, context, Token.Comma);
    }

    expect(parser, context, Token.RightParen);
    return expressions;
}

export function parsePrimaryExpression(parser: Parser, context: Context): any {

    switch (parser.token) {
        case Token.LetKeyword:
        case Token.YieldKeyword:
        case Token.AwaitKeyword:
        case Token.Arguments:
        case Token.Eval:
        case Token.Identifier:
            return parseIdentifier(parser, context);
        case Token.StringLiteral:
            return parseLiteral(parser, context);
        case Token.BigInt:
            return parseBigIntLiteral(parser, context);
        case Token.NumericLiteral:
            return parseLiteral(parser, context);
        case Token.FalseKeyword:
        case Token.TrueKeyword:
        case Token.NullKeyword:
            return parseNullOrTrueOrFalseLiteral(parser, context);
        case Token.ThisKeyword:
            return parseThisExpression(parser, context);
        case Token.FunctionKeyword:
            return parseFunctionExpression(parser, context & ~Context.Async);
        case Token.AsyncKeyword:
            return parseAsyncFunctionExpressionOrAsyncIdentifier(parser, context);
        case Token.LeftBrace:
            return parseObjectLiteral(parser, context);
        case Token.ClassKeyword:
            return parseClassExpression(parser, context);
        case Token.LeftParen:
            return parseParenthesizedExpression(parser, context);
        case Token.LeftBracket:
            return parseArrayLiteral(parser, context);
            case Token.Divide:
            case Token.DivideAssign:

                return parseRegularExpressionLiteral(parser, context);
            case Token.TemplateTail:
                return parseTemplateLiteral(parser, context);
            case Token.TemplateCont:
                return parseTemplate(parser, context);
        default:
            if (parser.token & (Token.Contextual | Token.FutureReserved | Token.Reserved)) {
              return parseIdentifier(parser, context);
            }
            report(parser, getUnexpectedTokenMessage(parser, context));
    }
}

/**
 * Parse regular expression literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseRegularExpressionLiteral(parser: Parser, context: Context): ESTree.RegExpLiteral {
  const pos = getLocation(parser);
  scanRegularExpression(parser, context);
  const { tokenRegExp, tokenValue, tokenRaw } = parser;
  nextToken(parser, context);
  const node: any = finishNode(parser, context, pos, {
      type: 'Literal',
      value: tokenValue,
      regex: tokenRegExp,
  });

  if (context & Context.OptionsRaw) node.raw = tokenRaw;

  return node;
}

/**
 * Parse template literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TemplateLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseTemplateLiteral(parser: Parser, context: Context): ESTree.TemplateLiteral {
  const pos = getLocation(parser);
  return finishNode(parser, context, pos, {
      type: 'TemplateLiteral',
      expressions: [],
      quasis: [parseTemplateSpans(parser, context)],
  });
}

/**
* Parse template head
*
* @param parser Parser object
* @param context Context masks
* @param cooked Cooked template value
* @param raw Raw template value
* @param pos Current location
*/

function parseTemplateHead(
parser: Parser,
context: Context,
cooked: string | null = null,
raw: string,
): ESTree.TemplateElement {
  parser.token = consumeTemplateBrace(parser, context);
  const pos = getLocation(parser);
  return finishNode(parser, context, pos, {
      type: 'TemplateElement',
      value: {
          cooked,
          raw,
      },
      tail: false,
  });
}

/**
* Parse template
*
* @param parser Parser object
* @param context Context masks
* @param expression Expression AST node
* @param quasis Array of Template elements
*/

function parseTemplate(
  parser: Parser,
  context: Context,
  expressions: ESTree.Expression[] = [],
  quasis: ESTree.TemplateElement[] = [],
): ESTree.TemplateLiteral {
  const pos = getLocation(parser);
  const { tokenValue, tokenRaw } = parser;

  expect(parser, context, Token.TemplateCont);

  expressions.push(parseExpression(parser, context));
  quasis.push(parseTemplateHead(parser, context, tokenValue, tokenRaw));

  if (parser.token === Token.TemplateTail) {
      quasis.push(parseTemplateSpans(parser, context));
  } else {
      parseTemplate(parser, context, expressions, quasis);
  }

  return finishNode(parser, context, pos, {
      type: 'TemplateLiteral',
      expressions,
      quasis,
  });
}
/**
 * Parse template spans
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TemplateSpans)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param loc Current AST node location
 */

function parseTemplateSpans(parser: Parser, context: Context): ESTree.TemplateElement {
  const pos = getLocation(parser);
  const { tokenValue, tokenRaw } = parser;

  expect(parser, context, Token.TemplateTail);

  return finishNode(parser, context, pos, {
      type: 'TemplateElement',
      value: {
          cooked: tokenValue,
          raw: tokenRaw,
      },
      tail: true,
  });
}
/**
 * Parses either null or boolean literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BooleanLiteral)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseNullOrTrueOrFalseLiteral(parser: Parser, context: Context): ESTree.Literal {
    const pos = getLocation(parser);
    const { token } = parser;
    const raw = tokenDesc(token);
    parser.flags &= ~Flags.Assignable;
    nextToken(parser, context);
    return finishNode(parser, context, pos, {
        type: 'Literal',
        value: token === Token.NullKeyword ? null : raw === 'true',
    });

   // if (context & Context.OptionsRaw) node.raw = raw;
}

export function parseIdentifier(parser: Parser, context: Context): ESTree.Identifier {
    const pos = getLocation(parser);
    const { tokenValue } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, pos, {
      type: 'Identifier',
      name: tokenValue
  });
}

/**
 * Parses string and number literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NumericLiteral)
 * @see [Link](https://tc39.github.io/ecma262/#prod-StringLiteral)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseLiteral(parser: Parser, context: Context): ESTree.Literal {
    const pos = getLocation(parser);
    const { tokenValue, tokenRaw } = parser;
    parser.flags &= ~Flags.Assignable;
    nextToken(parser, context);
    const node: any = finishNode(parser, context, pos, {
        type: 'Literal',
        value: tokenValue,
    });
    if (context & Context.OptionsRaw) node.raw = tokenRaw;
    return node;
}

/**
 * Parses BigInt literal (stage 3 proposal)
 *
 * @see [Link](https://tc39.github.io/proposal-bigint/)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBigIntLiteral(parser: Parser, context: Context): ESTree.BigIntLiteral {
    const pos = getLocation(parser);
    const { tokenValue, tokenRaw } = parser;
    parser.flags &= ~Flags.Assignable;
    nextToken(parser, context);
    return finishNode(parser, context, pos, {
        type: 'Literal',
        value: tokenValue,
        bigint: tokenRaw,
    });
}

/**
 * Parse this expression
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseThisExpression(parser: Parser, context: Context): ESTree.ThisExpression {
    const pos = getLocation(parser);
    nextToken(parser, context);
    parser.flags &= ~Flags.Assignable;
    return finishNode(parser, context, pos, {
         type: 'ThisExpression',
     });
 }

/**
 * Parse arrow function
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrowFunction)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseArrowFunction(
    parser: Parser,
    context: Context,
    state: ModifierState,
    pos: Location,
    params: any[]): ESTree.ArrowFunctionExpression {
    expect(parser, context, Token.Arrow);
    context = swapContext(context, state);
    for (const i in params) reinterpret(parser, context, params[i]);
    let body: any;
    const expression = parser.token !== Token.LeftBrace;
    if (!expression) {
        body = parseFunctionBody(parser, context | Context.InFunctionBody);
    } else {
        body = parseAssignmentExpression(parser, context);
    }

    return finishNode(parser, context, pos, {
        type: 'ArrowFunctionExpression',
        body,
        params,
        id: null,
        async: !!(state & ModifierState.Async),
        generator: false,
        expression,
    });
}

/**
 * Parses cover parenthesized expression and arrow parameter list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-parseCoverParenthesizedExpressionAndArrowParameterList)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseParenthesizedExpression(parser: Parser, context: Context): any {
    expect(parser, context, Token.LeftParen);
    if (consume(parser, context, Token.RightParen)) {
        if (parser.token === Token.Arrow) {
            return [];
        }
    }
    const expr = parseExpression(parser, context);
    expect(parser, context, Token.RightParen);
    if (parser.token === Token.Arrow) {
        return expr.type === 'SequenceExpression' ? expr.expressions : [expr];
    }
    return expr;
}

/**
 * Parse array literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseArrayLiteral(parser: Parser, context: Context): ESTree.ArrayExpression {
    // ArrayLiteral :
    //   [ Elisionopt ]
    //   [ ElementList ]
    //   [ ElementList , Elisionopt ]
    //
    // ElementList :
    //   Elisionopt AssignmentExpression
    //   Elisionopt ... AssignmentExpression
    //   ElementList , Elisionopt AssignmentExpression
    //   ElementList , Elisionopt SpreadElement
    //
    // Elision :
    //   ,
    //   Elision ,
    //
    // SpreadElement :
    //   ... AssignmentExpression
    //
    //
    const pos = getLocation(parser);
    expect(parser, context, Token.LeftBracket);
    context = (context | Context.DisallowIn | Context.Asi) ^ (Context.DisallowIn | Context.Asi);
    const elements: (ESTree.Expression | ESTree.SpreadElement | null)[] = [];

    while (parser.token !== Token.RightBracket) {
        if (consume(parser, context, Token.Comma)) {
            elements.push(null);
        } else if (parser.token === Token.Ellipsis) {
            elements.push(parseSpreadElement(parser, context));
            if (parser.token !== Token.RightBracket) {
                expect(parser, context, Token.Comma);
            }
        } else {
            elements.push(parseAssignmentExpression(parser, context));
            if (parser.token !== Token.RightBracket) expect(parser, context, Token.Comma);
        }
    }
    expect(parser, context, Token.RightBracket);
    return finishNode(parser, context, pos, {
        type: 'ArrayExpression',
        elements,
    });
}

/**
 * Parse spread element
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SpreadElement)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseSpreadElement(parser: Parser, context: Context): ESTree.SpreadElement {
    expect(parser, context, Token.Ellipsis);
    const argument = parseAssignmentExpression(parser, context);
    return {
        type: 'SpreadElement',
        argument,
    };
}

/**
 * Parses function expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionExpression)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseFunctionExpression(
    parser: Parser,
    context: Context,
    state: ModifierState = ModifierState.None
): ESTree.FunctionExpression {
    const pos = getLocation(parser);
    expect(parser, context, Token.FunctionKeyword);
    if (consume(parser, context, Token.Multiply)) state |= ModifierState.Generator;
    let id: ESTree.Identifier | null = null;
    if (parser.token & Token.Keyword) {
        id = parseBindingIdentifier(parser, context);
    }
    context = swapContext(context, state);
    const {
        params,
        body
    } = parseFormalListAndBody(parser, context);
    return finishNode(parser, context, pos, {
        type: 'FunctionExpression',
        body,
        params,
        async: !!(state & ModifierState.Async),
        generator: !!(state & ModifierState.Generator),
        expression: false,
        id
    });
}

/**
 * Parses formal parameters and function body.
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionBody)
 * @see [Link](https://tc39.github.io/ecma262/#prod-FormalParameters)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseFormalListAndBody(parser: Parser, context: Context): any {
    const params = parseFormalParameters(parser, context);
    const body = parseFunctionBody(parser, context | Context.InFunctionBody);
    return {
        params,
        body
    };
}

/**
 * Parse formal parameters
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FormalParameters)
 *
 * @param Parser object
 * @param Context masks
 * @param Optional objectstate. Default to none
 */
function parseFormalParameters(parser: Parser, context: Context): any {
    context = context | Context.InParameter;
    parser.flags = (parser.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;
    expect(parser, context, Token.LeftParen);
    const args: any = [];
    parseDelimitedBindingList(parser, context, BindingType.Args, BindingOrigin.FunctionArgs, args);
    expect(parser, context, Token.RightParen);
    return args;
}

/**
 * Parse funciton body
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionBody)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseFunctionBody(parser: Parser, context: Context): ESTree.BlockStatement {
    const pos = getLocation(parser);
    const body: ESTree.Statement[] = [];

    expect(parser, context, Token.LeftBrace);

    if (parser.token !== Token.RightBrace) {

        // Note: A separate "while" loop is used to avoid unseting the
        // mutual flags within the iteration loop itself.
        while (parser.token === Token.StringLiteral) {
            const { tokenRaw, tokenValue } = parser;
            body.push(parseDirective(parser, context));
            if (tokenRaw.length === /* length of prologue*/ 12 && tokenValue === 'use strict') {
                if (parser.flags & Flags.SimpleParameterList) {
                    recordErrors(parser, context, Errors.IllegalUseStrict);
                } else if (parser.flags & Flags.StrictReserved) {
                    recordErrors(parser, context, Errors.UnexpectedStrictReserved);
                } else if (parser.flags & Flags.StrictEvalArguments) {
                    recordErrors(parser, context, Errors.StrictEvalArguments);
                }
                context |= Context.Strict;
            }
        }

        parser.flags = (parser.flags | Flags.StrictReserved | Flags.StrictEvalArguments) ^ (Flags.StrictReserved | Flags.StrictEvalArguments);

        const previousSwitchStatement = parser.switchStatement;
        const previousIterationStatement = parser.iterationStatement;

        if (parser.switchStatement === LabelState.Iteration) {
            parser.switchStatement = LabelState.CrossingBoundary;
        }

        if (parser.iterationStatement === LabelState.Iteration) {
            parser.iterationStatement = LabelState.CrossingBoundary;
        }

        parser.labelSetStack[parser.labelDepth] = parser.functionBoundaryStack;
        parser.iterationStack[parser.labelDepth] = LabelState.Empty;
        parser.labelDepth++;


        while (parser.token !== Token.RightBrace) {
            body.push(parseStatementListItem(parser, context));
        }

        parser.labelDepth--;
        parser.switchStatement = previousSwitchStatement;
        parser.iterationStatement = previousIterationStatement;
    }

    expect(parser, context, Token.RightBrace);

    return finishNode(parser, context, pos, {
        type: 'BlockStatement',
        body,
    });
}

/**
 * Parse property name
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-PropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parsePropertyName(parser: Parser, context: Context): any {
    switch (parser.token) {
        case Token.NumericLiteral:
        case Token.StringLiteral:
            return parseLiteral(parser, context);
        case Token.LeftBracket:
            return parseComputedPropertyName(parser, context);
        default:
            return parseIdentifier(parser, context);
    }
}

/**
 * Parse computed property names
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ComputedPropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseComputedPropertyName(parser: Parser, context: Context): ESTree.Expression {
    expect(parser, context, Token.LeftBracket);
    const key: ESTree.Expression = parseAssignmentExpression(parser, context);
    expect(parser, context, Token.RightBracket);
    return key;
}

/**
 * Parses class declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseClassExpression(parser: Parser, context: Context): any {
    const pos = getLocation(parser);
    context = context | Context.Strict;
    expect(parser, context, Token.ClassKeyword);
    let id: ESTree.Identifier | null = null;
    if ((parser.token & Token.Identifier) === Token.Identifier || parser.token & Token.Keyword && parser.token !== Token.ExtendsKeyword) {
        id = parseBindingIdentifier(parser, context);
    }
    let superClass: ESTree.Expression | null = null;
    if (consume(parser, context, Token.ExtendsKeyword)) {
        superClass = parseLeftHandSideExpression(parser, context | Context.Strict, pos);
    }

    const body = parseClassBodyAndElementList(parser, context);

    return finishNode(parser, context, pos, {
        type: 'ClassExpression',
        id,
        superClass,
        body
    });
}

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

export function parseClassBodyAndElementList(parser: Parser, context: Context): ESTree.ClassBody {
    const pos = getLocation(parser);
    context = (context | Context.TaggedTemplate) ^ Context.TaggedTemplate;
    expect(parser, context, Token.LeftBrace);
    const body: (ESTree.MethodDefinition | ESTree.FieldDefinition)[] = [];
    while (parser.token !== Token.RightBrace) {
        if (consume(parser, context, Token.Semicolon)) continue;
        body.push(parseClassElement(parser, context));
    }
    expect(parser, context, Token.RightBrace);

    return finishNode(parser, context, pos, {
        type: 'ClassBody',
        body,
    });
}

/**
 * Parse class element and class public instance fields & private instance fields
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassElement)
 * @see [Link](https://tc39.github.io/proposal-class-public-fields/)
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseClassElement(parser: Parser, context: Context): any {
    const pos = getLocation(parser);
    let kind = 'method';
    let isStatic = false;
    let value: any;
    let state = ModifierState.None;
    if (consume(parser, context, Token.Multiply)) state = state | ModifierState.Generator;
    let token = parser.token;
    let key = parsePropertyName(parser, context);
    if (parser.tokenValue === 'constructor') {
        if (state & ModifierState.Generator) {
            recordErrors(parser, context, Errors.InvalidConstructor);
        } else if (state & ModifierState.Heritage) context |= Context.AllowSuperProperty;
        state |= ModifierState.Constructor;
    }

    if (parser.token !== Token.LeftParen) {

        if (token === Token.StaticKeyword) {
            isStatic = true;
            token = parser.token;
            if (parser.tokenValue === 'prototype') recordErrors(parser, context, Errors.StaticPrototype);
            key = parsePropertyName(parser, context);
        }

        if (token === Token.AsyncKeyword && !(parser.flags & Flags.NewLine)) {
            token = parser.token;
            state = state | ModifierState.Async;
            if (consume(parser, context, Token.Multiply)) state = state | ModifierState.Generator;
            token = parser.token;
            key = parsePropertyName(parser, context);
            if (parser.token === Token.LeftParen) {
                value = parseMethod(parser, context, state);
            }
        } else if (token === Token.GetKeyword || token === Token.SetKeyword) {
            kind = token === Token.GetKeyword ? 'get' : 'set';
            if (consume(parser, context, Token.Multiply)) state = state | ModifierState.Generator;
            token = parser.token;
            key = parsePropertyName(parser, context);
        }
    }

    if (parser.token === Token.LeftParen) {
        if (token !== Token.LeftBracket && state & ModifierState.Constructor) {
            if (parser.flags & Flags.HasConstructor) {
                recordErrors(parser, context, Errors.Unexpected);
            } else parser.flags |= Flags.HasConstructor;
        }
        value = parseMethod(parser, context, state);
    }

    return finishNode(parser, context, pos, {
        type: 'MethodDefinition',
        kind,
        static: isStatic,
        computed: token === Token.LeftBracket,
        key,
        value,
    });
}

/**
 * Parse method
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-GeneratorMethod)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncMethod)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncGeneratorMethod)
 * @see [Link](https://tc39.github.io/ecma262/#prod-PropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseMethod(
    parser: Parser,
    context: Context,
    state: ModifierState,
): ESTree.FunctionExpression {
    const pos = getLocation(parser);
    context = swapContext(context, state);
    const { params, body } = parseFormalListAndBody(parser, context);
    return finishNode(parser, context, pos, {
        type: 'FunctionExpression',
        params,
        body,
        async: !!(state & ModifierState.Async),
        generator: !!(state & ModifierState.Generator),
        expression: false,
        id: null,
    });
}

/**
 * Parses object literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ObjectLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseObjectLiteral(parser: Parser, context: Context): ESTree.ObjectExpression {
    const pos = getLocation(parser);
    expect(parser, context, Token.LeftBrace);
    const properties: (ESTree.Property | ESTree.SpreadElement)[] = [];
    context = (context | Context.DisallowIn | Context.Asi) ^ (Context.DisallowIn | Context.Asi);
    while (parser.token !== Token.RightBrace) {
        properties.push(parser.token === Token.Ellipsis ?
            parseSpreadProperties(parser, context) :
            parsePropertyDefinition(parser, context));
        if (parser.token !== Token.RightBrace) expect(parser, context, Token.Comma);
    }

    expect(parser, context, Token.RightBrace);

    return finishNode(parser, context, pos, {
        type: 'ObjectExpression',
        properties,
    });
}
/**
 * Parse object spread properties
 *
 * @see [Link](https://tc39.github.io/proposal-object-rest-spread/#Spread)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseSpreadProperties(parser: Parser, context: Context): ESTree.SpreadElement {
    const pos = getLocation(parser);
    expect(parser, context, Token.Ellipsis);
    const argument = parseAssignmentExpression(parser, context);
    return finishNode(parser, context, pos, {
        type: 'SpreadElement',
        argument,
    });
}

/**
 * Parse property definition
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-PropertyDefinition)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parsePropertyDefinition(parser: Parser, context: Context): ESTree.Property {
    const pos = getLocation(parser);
    let value;
    let state = ModifierState.Method;

    if (consume(parser, context, Token.Multiply)) state = state | ModifierState.Generator;

    let token = parser.token;

    let key = parsePropertyName(parser, context);

    if (token === Token.AsyncKeyword && !(parser.flags & Flags.NewLine)) {
        if (parser.token & (Token.Identifier | Token.StringLiteral | Token.Contextual | Token.NumericLiteral) ||
            parser.token === Token.Multiply || parser.token === Token.LeftBracket) {
            if (state & ModifierState.Generator) recordErrors(parser, context, Errors.Unexpected);
            state = state | ModifierState.Async;
            if (consume(parser, context, Token.Multiply)) state = state | ModifierState.Generator;
            token = parser.token;
            key = parsePropertyName(parser, context);
        }
    }

    if (token === Token.GetKeyword || token === Token.SetKeyword) {
        if (parser.token & (Token.Identifier | Token.StringLiteral | Token.Contextual | Token.NumericLiteral) ||
            parser.token === Token.Multiply || parser.token === Token.LeftBracket) {
            if (state & ModifierState.Generator) recordErrors(parser, context, Errors.Unexpected);
            if (consume(parser, context, Token.Multiply)) state = state | ModifierState.Generator;
            state = state & ~ModifierState.Method | (token === Token.GetKeyword ? ModifierState.Getter : ModifierState.Setter);
            token = parser.token;
            key = parsePropertyName(parser, context);
        }
    }

    if (parser.token === Token.LeftParen) {
        value = parseMethod(parser, context, state);
    } else {

        if (state & (ModifierState.Generator | ModifierState.Async)) {
            recordErrors(parser, context, Errors.Unexpected);
        }

        state = state & ~ModifierState.Method;

        if (parser.token === Token.Colon) {
            if (token !== Token.LeftBracket && parser.tokenValue === '__proto__') {
                // TODO!
            }
            nextToken(parser, context);
            value = parseAssignmentExpression(parser, context);
        } else {

            state |= ModifierState.Shorthand;

            if (parser.token === Token.Assign) {
                // TODO: 'CoverInitializedName'
                nextToken(parser, context);
                value = parseAssignmentPattern(parser, context, key as ESTree.PatternTop, pos);
            } else {
                value = key;
            }
        }
    }

    return finishNode(parser, context, pos, {
        type: 'Property',
        key,
        value,
        computed: token === Token.LeftBracket,
        method: (state & ModifierState.Method) === ModifierState.Method,
        shorthand: (state & ModifierState.Shorthand) === ModifierState.Shorthand,
        kind: !(state & ModifierState.Getter | state & ModifierState.Setter) ?
            'init' :
            (state & ModifierState.Setter) ?
            'set' :
            'get',
    });
}

/**
 * Parses either async function declaration or async identifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncFunctionDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAsyncFunctionExpressionOrAsyncIdentifier(
    parser: Parser,
    context: Context
): any {
    return lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, /* isLookaHead */ false) ?
        parseFunctionExpression(parser, context, ModifierState.Async) :
        parseIdentifier(parser, context);
}
