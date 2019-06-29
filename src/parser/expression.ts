import * as ESTree from '../estree';
import { report, Errors } from '../errors';
import { parseBindingIdentifierOrPattern, parseAssignmentPattern } from './pattern';
import { parseStatementListItem, parseBlockStatement, parseDirective } from './statement';
import { Token, KeywordDescTable } from '../token';
import { scanSingleToken } from '../scanner';
import { scanTemplateTail } from '../scanner/template';
import {
  optional,
  expect,
  recordTokenValue,
  checkIfLexicalAlreadyBound,
  validateFunctionArgs,
  lookAheadOrScan,
  optionalBit,
  Context,
  Flags,
  LabelState,
  ParserState,
  Type,
  Origin,
  Arrows,
  reinterpret,
  validateBindingIdentifier,
  nextTokenIsFuncKeywordOnSameLine,
  isValidSimpleAssignmentTarget,
  addCrossingBoundary,
  recordTokenValueAndDeduplicate,
  isValidIdentifier,
  ScopeState,
  ScopeType,
  createSubScope,
  createScope,
  Modifiers,
  acquireGrammar,
  secludeGrammar,
  secludeGrammarWithLocation,
  nameIsArgumentsOrEval,
  finishNode,
  ParenthesizedState
} from '../common';

/**
 * Parse formal parameters
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 * @param origin Origin
 */

export function parseFormalParameters(
  state: ParserState,
  context: Context,
  scope: ScopeState,
  origin: Origin,
  objState: Modifiers
): any {
  /**
   * FormalParameterList :
   *    [empty]
   *       FunctionRestParameter
   *      FormalsList
   *     FormalsList , FunctionRestParameter
   *
   *     FunctionRestParameter :
   *      ... BindingIdentifier
   *
   *     FormalsList :
   *      FormalParameter
   *     FormalsList , FormalParameter
   *
   *     FormalParameter :
   *      BindingElement
   *
   *     BindingElement :
   *      SingleNameBinding
   *   BindingPattern Initializeropt
   *
   */
  expect(state, context, Token.LeftParen);
  const { startIndex: start, startLine: line, startColumn: column } = state;
  const params: any[] = [];
  state.flags = (state.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;
  context = context | Context.InArgList;
  let hasComplexArgs = false;
  while (state.token !== Token.RightParen) {
    if (state.token === Token.Ellipsis) {
      hasComplexArgs = true;
      if (objState & Modifiers.Setter) report(state, Errors.BadSetterRestParameter);
      params.push(parseRestElement(state, context, scope, Type.ArgList, Origin.None));
      break; // rest parameter must be the last
    }

    if ((state.token & Token.Identifier) !== Token.Identifier) hasComplexArgs = true;
    let left: any = parseBindingIdentifierOrPattern(state, context, scope, Type.ArgList, origin, 0);
    if (optional(state, context | Context.AllowPossibleRegEx, Token.Assign)) {
      hasComplexArgs = true;
      if (context & (Context.Module | Context.AwaitContext) && state.token & Token.IsAwait)
        report(state, Errors.AwaitInParameter);
      if (context & (Context.Strict | Context.YieldContext) && state.token & Token.IsYield)
        report(state, Errors.YieldInParameter);
      left = parseAssignmentPattern(state, context, left, start, line, column);
    }
    params.push(left);
    if ((state.token as Token) !== Token.RightParen) {
      expect(state, context, Token.Comma);
    }
  }
  if (objState & Modifiers.Setter && params.length !== 1) {
    report(state, Errors.AccessorWrongArgs, 'Setter', 'one', '');
  }

  if (objState & Modifiers.Getter && params.length > 0) {
    report(state, Errors.AccessorWrongArgs, 'Getter', 'no', 's');
  }
  expect(state, context, Token.RightParen);
  if (hasComplexArgs || (context & (Context.Strict | Context.InMethod)) > 0) {
    validateFunctionArgs(state, scope.lex, hasComplexArgs);
  }
  if (hasComplexArgs) state.flags |= Flags.SimpleParameterList;
  return params;
}

/**
 * Parse assignment rest element
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentRestElement)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param endToken Token
 * @param scope Scope state
 * @param type Binding type
 */

export function parseRestElement(
  state: ParserState,
  context: Context,
  scope: ScopeState,
  type: Type,
  origin: Origin
): ESTree.RestElement {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  expect(state, context, Token.Ellipsis);
  if (context & Context.ParentheziedContext && state.token & Token.IsAwait) state.flags |= Flags.SeenAwait;
  const argument = parseBindingIdentifierOrPattern(state, context, scope, type, origin, 0);
  return finishNode(state, context, start, line, column, {
    type: 'RestElement',
    argument
  } as any);
}

/**
 * Parse function body
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope instance
 */

export function parseFunctionBody(
  state: ParserState,
  context: Context,
  scope: ScopeState,
  firstRestricted: string | undefined,
  origin: Origin
): ESTree.BlockStatement {
  const body: any[] = [];
  const { startIndex: start, startLine: line, startColumn: column } = state;

  expect(state, context | Context.AllowPossibleRegEx, Token.LeftBrace);

  const prevContext = context;

  while (state.token === Token.StringLiteral) {
    if (state.index - state.startIndex < 13 && state.tokenValue === 'use strict') {
      // TODO: (fkleuver) remove this from the hot loop
      if (state.flags & Flags.SimpleParameterList) report(state, Errors.IllegalUseStrict);
      context |= Context.Strict;
    }
    body.push(parseDirective(state, context, scope));
  }
  if (context & Context.Strict) {
    if ((state.flags & Flags.HasStrictReserved) === Flags.HasStrictReserved)
      report(state, Errors.UnexpectedStrictReserved);
    if (state.flags & Flags.StrictEvalArguments) {
      report(state, Errors.StrictEvalArguments);
    }
    if ((firstRestricted && firstRestricted === 'eval') || firstRestricted === 'arguments')
      report(state, Errors.StrictFunctionName);
  }

  context = context | Context.TopLevel;

  if ((prevContext & Context.Strict) < 1 && (context & Context.Strict) > 0)
    validateFunctionArgs(state, scope.lex['@'], false);

  if (state.token !== Token.RightBrace) {
    const previousSwitchStatement = state.switchStatement;
    const previousIterationStatement = state.iterationStatement;

    if ((state.iterationStatement & LabelState.Iteration) === LabelState.Iteration) {
      state.iterationStatement = LabelState.CrossingBoundary;
    }

    addCrossingBoundary(state);
    while (state.token !== (Token.RightBrace as Token)) {
      body.push(parseStatementListItem(state, context, scope));
    }
    state.labelDepth--;
    state.switchStatement = previousSwitchStatement;
    state.iterationStatement = previousIterationStatement;
  }

  expect(
    state,
    origin & (Origin.Arrow | Origin.Declaration) ? context | Context.AllowPossibleRegEx : context,
    Token.RightBrace
  );

  return finishNode(state, context, start, line, column, {
    type: 'BlockStatement',
    body
  });
}

export function parseExpressions(state: ParserState, context: Context): any {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  const expr = secludeGrammar(state, context, 0, parseAssignmentExpression);
  if (state.token !== Token.Comma) return expr;
  return parseSequenceExpression(state, context, expr, start, line, column);
}

/**
 * Parse secuence expression
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseSequenceExpression(
  state: ParserState,
  context: Context,
  left: ESTree.Expression,
  start: number,
  line: number,
  column: number
): ESTree.SequenceExpression {
  const expressions: ESTree.Expression[] = [left];
  while (optional(state, context | Context.AllowPossibleRegEx, Token.Comma)) {
    expressions.push(secludeGrammar(state, context, 0, parseAssignmentExpression));
  }
  return finishNode(state, context, start, line, column, {
    type: 'SequenceExpression',
    expressions
  });
}

/**
 * Parse yield expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-YieldExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseYieldExpression(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.YieldExpression | ESTree.Identifier {
  // YieldExpression ::
  //   'yield' ([no line terminator] '*'? AssignmentExpression)?
  if (context & Context.InArgList) {
    // https://tc39.github.io/ecma262/#sec-generator-function-definitions-static-semantics-early-errors
    report(state, Errors.YieldInParameter);
  }
  expect(state, context | Context.AllowPossibleRegEx, Token.YieldKeyword);
  state.flags = state.flags | Flags.SeenYield;
  let argument: ESTree.Expression | null = null;
  let delegate = false; // yield*
  if ((state.flags & Flags.NewLine) < 1) {
    delegate = optional(state, context, Token.Multiply);
    if (state.token & Token.IsExpressionStart || delegate) {
      argument = parseAssignmentExpression(state, context);
    }
  }
  return finishNode(state, context, start, line, column, {
    type: 'YieldExpression',
    argument,
    delegate
  });
}

/**
 * Parses assignment expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentExpression)
 *
 * @param parser Parser object
 * @param context  Context masks
 */

export function parseAssignmentExpression(state: ParserState, context: Context): any {
  /**
   * AssignmentExpression ::
   *
   *      1) ConditionalExpression
   *      2) LeftHandSideExpression = AssignmentExpression
   *      3) LeftHandSideExpression AssignmentOperator AssignmentExpression
   *      4) ArrowFunctionExpression
   *      5) AsyncArrowFunctionExpression
   *      6) YieldExpression
   */

  const { token, tokenValue, startIndex: start, startLine: line, startColumn: column } = state;

  if (token & Token.IsYield && context & Context.YieldContext)
    return parseYieldExpression(state, context, start, line, column);

  const expr: any = acquireGrammar(state, context, 0, parseBinaryExpression);

  if ((state.flags & Flags.NewLine) < 1) {
    if (
      token & Token.IsAsync &&
      ((state.token & Token.IsIdentifier) === Token.IsIdentifier ||
        state.token === Token.EscapedStrictReserved ||
        (!(context & Context.YieldContext) && state.token & Token.IsYield) === Token.IsYield)
    ) {
      const { tokenValue } = state;
      const arg = parseIdentifier(state, context);
      if (state.token !== Token.Arrow)
        report(state, Errors.UnexpectedToken, KeywordDescTable[state.token & Token.Type]);
      const scope = createScope(ScopeType.ArgumentList);
      recordTokenValueAndDeduplicate(state, context, scope, Type.ArgList, Origin.None, true, tokenValue);
      return parseArrowFunctionExpression(state, context, scope, [arg], 1, start, line, column, Type.ConciseBody);
    }

    if (
      state.token === Token.Arrow &&
      (token & Token.IsIdentifier ||
        token === Token.LeftParen ||
        token === Token.EscapedKeyword ||
        token === Token.EscapedStrictReserved)
    ) {
      let { type, scope: arrowScope, params } = expr;
      state.bindable = state.assignable = false;
      state.pendingCoverInitializeError = null;
      if ((type & Arrows.Parenthesized) < 1) {
        if ((token & Token.FutureReserved) === Token.FutureReserved) {
          state.flags |= Flags.HasStrictReserved;
        } else if (tokenValue === 'eval' || tokenValue === 'arguments') {
          if (context & Context.Strict) report(state, Errors.StrictEvalArguments);
          state.flags |= Flags.StrictEvalArguments;
        }
        arrowScope = createScope(ScopeType.ArgumentList);
        params = [expr];
        type = Type.ConciseBody;
        recordTokenValueAndDeduplicate(state, context, arrowScope, Type.ArgList, Origin.None, true, tokenValue);
      }
      return parseArrowFunctionExpression(
        state,
        context,
        arrowScope,
        params,
        ((type & Arrows.Async) >> 2) as 0 | 1,
        start,
        line,
        column,
        type
      );
    }
  }
  let operator: Token = Token.EndOfSource;
  if ((state.token & Token.IsAssignOp) === Token.IsAssignOp) {
    if (context & Context.Strict && nameIsArgumentsOrEval((expr as ESTree.Identifier).name)) {
      report(state, Errors.InvalidEvalArgument, expr.name === 'eval' ? 'eval' : 'arguments');
    } else if (state.token === Token.Assign) {
      if (!state.assignable) report(state, Errors.InvalidLHSInAssignment);
      reinterpret(state, expr);
      operator = state.token;
      scanSingleToken(state, context | Context.AllowPossibleRegEx);
      if (context & Context.ParentheziedContext) {
        state.flags |= Flags.SimpleParameterList;
        if (context & (Context.Strict | Context.YieldContext) && state.token & Token.IsYield) {
          state.flags |= Flags.SeenYield;
        } else if (state.token & Token.IsAwait) {
          state.flags |= Flags.SeenAwait;
        }
      }
    } else {
      if (!state.assignable || !isValidSimpleAssignmentTarget(expr)) report(state, Errors.InvalidLHSInAssignment);
      state.bindable = state.assignable = false;
      operator = state.token;
      scanSingleToken(state, context | Context.AllowPossibleRegEx);
    }

    const right = secludeGrammar(state, context, 0, parseAssignmentExpression);
    state.pendingCoverInitializeError = null;
    return finishNode(state, context, start, line, column, {
      type: 'AssignmentExpression',
      left: expr,
      operator: KeywordDescTable[operator & Token.Type],
      right
    } as any);
  }

  return parseConditionalExpression(state, context, expr, start, line, column);
}

/**
 * Parse conditional expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ConditionalExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseConditionalExpression(
  state: ParserState,
  context: Context,
  test: ESTree.Expression,
  start: number,
  line: number,
  column: number
): ESTree.Expression | ESTree.ConditionalExpression {
  // ConditionalExpression ::
  // LogicalOrExpression
  // LogicalOrExpression '?' AssignmentExpression ':' AssignmentExpression
  if (!optional(state, context | Context.AllowPossibleRegEx, Token.QuestionMark)) return test;
  const consequent = secludeGrammar(
    state,
    (context | Context.DisallowInContext) ^ Context.DisallowInContext,
    0,
    parseAssignmentExpression
  );
  expect(state, context | Context.AllowPossibleRegEx, Token.Colon);
  const alternate = secludeGrammar(state, context, 0, parseAssignmentExpression);
  state.bindable = state.assignable = false;
  return finishNode(state, context, start, line, column, {
    type: 'ConditionalExpression',
    test,
    consequent,
    alternate
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
  state: ParserState,
  context: Context,
  minPrec: number,
  start: number = state.startIndex,
  line: number = state.startLine,
  column: number = state.startColumn,
  left: any = parseUnaryExpression(state, context)
): ESTree.Expression {
  const bit = -((context & Context.DisallowInContext) > 0) & Token.InKeyword;
  let t: Token;
  let prec: number;

  while (state.token & Token.IsBinaryOp) {
    t = state.token;
    prec = t & Token.Precedence;
    if (prec + (((t === Token.Exponentiate) as any) << 8) - (((bit === t) as any) << 12) <= minPrec) break;
    scanSingleToken(state, context | Context.AllowPossibleRegEx);
    left = finishNode(state, context, start, line, column, {
      type: t & Token.IsLogical ? 'LogicalExpression' : 'BinaryExpression',
      left,
      right: secludeGrammar(state, context, prec, parseBinaryExpression),
      operator: KeywordDescTable[t & Token.Type]
    } as any);
    state.assignable = state.bindable = false;
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

function parseAwaitExpression(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.AwaitExpression | ESTree.Identifier | ESTree.ArrowFunctionExpression {
  state.assignable = false;
  if (context & Context.InArgList) report(state, Errors.AwaitInParameter);
  scanSingleToken(state, context | Context.AllowPossibleRegEx);
  return finishNode(state, context, start, line, column, {
    type: 'AwaitExpression',
    argument: secludeGrammar(state, context, 0, parseUnaryExpression)
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
function parseUnaryExpression(state: ParserState, context: Context): ESTree.Expression {
  /**
   *  UnaryExpression ::
   *   PostfixExpression
   *      1) UpdateExpression
   *      2) delete UnaryExpression
   *      3) void UnaryExpression
   *      4) typeof UnaryExpression
   *      5) + UnaryExpression
   *      6) - UnaryExpression
   *      7) ~ UnaryExpression
   *      8) ! UnaryExpression
   *      9) await UnaryExpression
   */
  const { token, startIndex: start, startLine: line, startColumn: column } = state;
  if ((token & Token.IsUnaryOp) === Token.IsUnaryOp) {
    const unaryOperator = state.token;
    scanSingleToken(state, context | Context.AllowPossibleRegEx);
    const argument: ESTree.Expression = secludeGrammar(state, context, 0, parseUnaryExpression);
    if (state.token === Token.Exponentiate) report(state, Errors.InvalidLOExponentation);
    if (context & Context.Strict && (unaryOperator & Token.DeleteKeyword) === Token.DeleteKeyword) {
      if (argument.type === 'Identifier') {
        report(state, Errors.StrictDelete);
      } else if (context & Context.OptionsNext && state.flags & Flags.HasPrivateName) {
        report(state, Errors.DeletePrivateField);
      }
    }
    state.bindable = state.assignable = false;
    return finishNode(state, context, start, line, column, {
      type: 'UnaryExpression',
      operator: KeywordDescTable[unaryOperator & Token.Type],
      argument,
      prefix: true
    });
  }

  return (context & Context.AwaitContext || (context & Context.InGlobal && context & Context.OptionsGlobalAwait)) &&
    token & Token.IsAwait
    ? parseAwaitExpression(state, context, start, line, column)
    : parseUpdateExpression(state, context, start, line, column);
}

/**
 * Parses update expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-UpdateExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseUpdateExpression(state: ParserState, context: Context, start: number, line: number, column: number): any {
  /**
   *  UpdateExpression:
   *      LeftHandSideExpression[?Yield]
   *      LeftHandSideExpression[?Yield][no LineTerminator here]++
   *      LeftHandSideExpression[?Yield][no LineTerminator here]--
   *      ++LeftHandSideExpression[?Yield]
   *      --LeftHandSideExpression[?Yield]
   */
  const { token } = state;
  if ((state.token & Token.IsUpdateOp) === Token.IsUpdateOp) {
    scanSingleToken(state, context | Context.AllowPossibleRegEx);
    const expr = parseLeftHandSideExpression(state, context, start, line, column);
    if (context & Context.Strict && (expr.name === 'eval' || expr.name === 'arguments')) {
      report(state, Errors.StrictLHSPrefixPostFix, 'Prefix');
    }
    if (!state.assignable) report(state, Errors.InvalidLHSInAssignment);
    state.bindable = state.assignable = false;
    return finishNode(state, context, start, line, column, {
      type: 'UpdateExpression',
      argument: expr,
      operator: KeywordDescTable[token & Token.Type],
      prefix: true
    } as any);
  }

  const expression = parseLeftHandSideExpression(state, context, start, line, column);

  if ((state.token & Token.IsUpdateOp) === Token.IsUpdateOp && (state.flags & Flags.NewLine) < 1) {
    if (context & Context.Strict && (expression.name === 'eval' || expression.name === 'arguments')) {
      report(state, Errors.StrictLHSPrefixPostFix, 'PostFix');
    }
    if (!state.assignable) report(state, Errors.InvalidLHSInAssignment);
    const operator = state.token;
    scanSingleToken(state, context);
    state.bindable = state.assignable = false;
    return finishNode(state, context, start, line, column, {
      type: 'UpdateExpression',
      argument: expression,
      operator: KeywordDescTable[operator & Token.Type],
      prefix: false
    } as any);
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
export function parseLeftHandSideExpression(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): any {
  // LeftHandSideExpression ::
  //   (NewExpression | MemberExpression) ...
  const expr: any =
    context & Context.OptionsNext && state.token === Token.ImportKeyword
      ? parseCallImportOrMetaProperty(state, context, false)
      : state.token === Token.SuperKeyword
      ? parseSuperExpression(state, context)
      : parseMemberExpression(
          state,
          context,
          start,
          line,
          column,
          parsePrimaryExpression(state, context, start, line, column)
        );
  return parseCallExpression(
    state,
    (context | Context.DisallowInContext) ^ Context.DisallowInContext,
    start,
    line,
    column,
    expr
  );
}

/**
 * Parse call expression
 *
 * @param parser Parer instance
 * @param context Context masks
 * @param pos Line / Colum info
 * @param expr Expression
 */
function parseCallExpression(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number,
  callee: any | ESTree.Super
): any {
  const isAsync = callee.name === 'async';
  const scope: ScopeState | null = state.bindable && isAsync ? createScope(ScopeType.BlockStatement) : null;
  const { flags } = state;
  let pState = ParenthesizedState.None;
  while (true) {
    callee = parseMemberExpression(state, context, start, line, column, callee);
    if (state.token !== Token.LeftParen) return callee;

    expect(state, context | Context.AllowPossibleRegEx, Token.LeftParen);
    let seenSpread = false;
    let spreadCount = 0;
    const params: (ESTree.Expression | ESTree.SpreadElement)[] = [];
    while (state.token !== <Token>Token.RightParen) {
      if (state.token === <Token>Token.Ellipsis) {
        state.flags = state.flags | Flags.SimpleParameterList;
        params.push(parseSpreadElement(state, context, Origin.None));
        seenSpread = true;
      } else {
        const { token } = state;

        if (isAsync && (token as Token) === Token.Identifier) {
          recordTokenValue(state, context, scope, Type.ArgList, Origin.None, 0, false, state.tokenValue);
        }

        if ((token & Token.IsYield) === Token.IsYield) {
          pState = pState | ParenthesizedState.Yield;
        } else if ((token as Token) === Token.LeftBrace || (token as Token) === Token.LeftBracket)
          state.flags |= Flags.SimpleParameterList;
        if ((token & Token.FutureReserved) === Token.FutureReserved) {
          pState = pState | ParenthesizedState.ReservedWords;
        } else if ((token & Token.IsAwait) === Token.IsAwait) {
          pState = pState | ParenthesizedState.Await;
        }

        params.push(secludeGrammar(state, context | Context.ParentheziedContext, 0, parseAsyncArgument));
      }
      if (state.token === <Token>Token.RightParen) break;
      expect(state, context | Context.AllowPossibleRegEx, Token.Comma);
      state.assignable = false;
      if (seenSpread) spreadCount++;
    }
    expect(state, context, Token.RightParen);

    if (state.token === <Token>Token.Arrow) {
      if (flags & Flags.NewLine) report(state, Errors.InvalidLineBreak, '=>');
      if (pState & ParenthesizedState.Yield) {
        if (context & (Context.YieldContext | Context.Strict)) report(state, Errors.YieldInParameter);
        state.flags |= Flags.HasStrictReserved;
      } else if (state.flags & Flags.SeenYield) {
        report(state, Errors.YieldInParameter);
      } else if (pState & ParenthesizedState.Await || state.flags & Flags.SeenAwait) {
        report(state, Errors.AwaitInParameter);
      }

      // Fixes cases like: `async().foo13 () => 1`
      if (!state.bindable) report(state, Errors.InvalidDestructExpr);
      state.bindable = state.assignable = false;
      if (spreadCount > 0) report(state, Errors.TrailingCommaAfterRest);
      state.bindable = false;
      return {
        type: Arrows.Async,
        scope,
        params
      };
    }

    state.flags =
      (state.flags | Flags.SeenYield | Flags.SeenAwait | Flags.SimpleParameterList) ^
      (Flags.SeenYield | Flags.SeenAwait | Flags.SimpleParameterList);

    state.bindable = state.assignable = false;
    callee = finishNode(state, context, start, line, column, {
      type: 'CallExpression',
      callee,
      arguments: params
    });
  }
}

/**
 * Parse either call expression or import expressions
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseCallImportOrMetaProperty(state: ParserState, context: Context, isNew: boolean): ESTree.Expression {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  const id = parseIdentifier(state, context);
  // Import.meta - Stage 3 proposal
  if (optional(state, context, Token.Period)) {
    if (context & Context.Module && state.tokenValue === 'meta') return parseMetaProperty(state, context, id);
    report(state, Errors.UnexpectedToken, KeywordDescTable[state.token & Token.Type]);
  } else if (isNew && state.token === Token.LeftParen)
    report(state, Errors.UnexpectedToken, KeywordDescTable[state.token & Token.Type]);

  const expr = parseImportExpression(state, context);
  return parseCallExpression(state, context, start, line, column, expr);
}

/**
 * Parse Import() expression. (Stage 3 proposal)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location
 */
function parseImportExpression(state: ParserState, context: Context): ESTree.ImportExpression {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  return finishNode(state, context, start, line, column, {
    type: 'Import'
  } as any);
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

export function parseMetaProperty(state: ParserState, context: Context, id: ESTree.Identifier): ESTree.MetaProperty {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  return finishNode(state, context, start, line, column, {
    meta: id,
    type: 'MetaProperty',
    property: parseIdentifier(state, context)
  });
}

function parseSuperExpression(state: ParserState, context: Context): ESTree.Super {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  scanSingleToken(state, context);
  state.assignable = state.bindable = false;
  switch (state.token) {
    case Token.LeftParen:
      // The super property has to be within a class constructor
      if ((context & Context.SuperCall) < 1) report(state, Errors.SuperNoConstructor);
      break;
    case Token.LeftBracket:
    case Token.Period:
      // new super() is never allowed.
      // super() is only allowed in derived constructor

      if ((context & Context.SuperProperty) < 1) report(state, Errors.InvalidSuperProperty);
      state.assignable = true;
      break;
    default:
      report(state, Errors.UnexpectedToken, 'super');
  }

  return finishNode(state, context, start, line, column, { type: 'Super' });
}

/**
 * Parse identifier name or private name (stage 3 proposal)
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementList)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseIdentifierNameOrPrivateName(
  state: ParserState,
  context: Context
): ESTree.PrivateName | ESTree.Identifier {
  if (!optional(state, context, Token.PrivateName)) return parseIdentifierName(state, context);
  const { startIndex: start, startLine: line, startColumn: column } = state;
  state.flags |= Flags.HasPrivateName;
  return finishNode(state, context, start, line, column, {
    type: 'PrivateName',
    name: state.tokenValue
  } as any);
}

/**
 * Parses identifier name
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-IdentifierName)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseIdentifierName(state: ParserState, context: Context): ESTree.Identifier {
  if (
    (state.token & (Token.IsIdentifier | Token.Keyword)) !== Token.IsIdentifier &&
    (state.token & Token.Keyword) !== Token.Keyword
  )
    report(state, Errors.Unexpected);
  return parseIdentifier(state, context);
}

/**
 * Parse member expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementList)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseMemberExpression(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number,
  expr: ESTree.CallExpression | ESTree.Expression
): ESTree.Expression {
  while (true) {
    switch (state.token) {
      case Token.Period:
        scanSingleToken(state, context);
        state.bindable = false;
        state.assignable = true;
        expr = finishNode(state, context, start, line, column, {
          type: 'MemberExpression',
          object: expr,
          computed: false,
          property: parseIdentifierName(state, context)
        });
        continue;
      case Token.LeftBracket: {
        scanSingleToken(state, context | Context.AllowPossibleRegEx);
        state.bindable = false;
        state.assignable = true;
        expr = finishNode(state, context, start, line, column, {
          type: 'MemberExpression',
          object: expr,
          computed: true,
          property: parseExpressions(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext)
        });
        expect(state, context, Token.RightBracket);
        break;
      }
      case Token.TemplateTail:
        state.bindable = state.assignable = false;
        expr = finishNode(state, context, state.startIndex, state.startLine, state.startColumn, {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi: parseTemplateLiteral(state, context)
        });
        break;
      case Token.TemplateCont:
        state.bindable = state.assignable = false;
        expr = finishNode(state, context, start, line, column, {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi: parseTemplate(
            state,
            context | Context.TaggedTemplate,
            state.startIndex,
            state.startLine,
            state.startColumn
          )
        });
        break;
      default:
        return expr;
    }
  }
}
/**
 * Parse template literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TemplateLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseTemplateLiteral(state: ParserState, context: Context): ESTree.TemplateLiteral {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  return finishNode(state, context, start, line, column, {
    type: 'TemplateLiteral',
    expressions: [],
    quasis: [parseTemplateTail(state, context)]
  });
}

/**
 * Parse template spans
 *
 * @param state Parser object
 * @param context Context masks
 * @param tail
 */

function parseTemplateSpans(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number,
  tail: boolean
): ESTree.TemplateElement {
  return finishNode(state, context, start, line, column, {
    type: 'TemplateElement',
    value: {
      cooked: state.tokenValue,
      raw: state.tokenRaw
    },
    tail
  });
}

/**
 * Parse template literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TemplateLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseTemplate(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.TemplateLiteral {
  /**
   * Template :
   *   NoSubstitutionTemplate
   *   TemplateHead
   *
   * NoSubstitutionTemplate :
   *   ` TemplateCharacters(opt) `
   *
   * TemplateHead :
   *   ` TemplateCharacters(opt) ${
   *
   * TemplateSubstitutionTail :
   *   TemplateMiddle
   *   TemplateTail
   *
   * TemplateMiddle :
   *   } TemplateCharacters(opt) ${
   *
   * TemplateTail :
   *   } TemplateCharacters(opt) `
   *
   * TemplateCharacters :
   *   TemplateCharacter TemplateCharacters(opt)
   *
   * TemplateCharacter :
   *   $ [lookahead ≠ {]
   *   \ EscapeSequence
   *   SourceCharacter (but not one of ` or \ or $)
   *
   */

  const quasis = [parseTemplateSpans(state, context, start, line, column, /* tail */ false)];
  expect(state, context | Context.AllowPossibleRegEx, Token.TemplateCont);
  state.bindable = state.assignable = false;
  const expressions = [parseExpressions(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext)];
  while ((state.token = scanTemplateTail(state, context)) !== Token.TemplateTail) {
    quasis.push(
      parseTemplateSpans(state, context, state.startIndex, state.startLine, state.startColumn, /* tail */ false)
    );
    expect(state, context | Context.AllowPossibleRegEx, Token.TemplateCont);
    expressions.push(parseExpressions(state, context));
  }
  quasis.push(
    parseTemplateSpans(state, context, state.startIndex, state.startLine, state.startColumn, /* tail */ true)
  );
  state.assignable = state.bindable = false;
  scanSingleToken(state, context);

  return finishNode(state, context, start, line, column, {
    type: 'TemplateLiteral',
    expressions,
    quasis
  });
}

/**
 * Parse template tail
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TemplateSpans)
 *
 * @param state Parser object
 * @param context Context masks
 */

function parseTemplateTail(state: ParserState, context: Context): ESTree.TemplateElement {
  const { tokenValue, tokenRaw, startIndex: start, startLine: line, startColumn: column } = state;
  expect(state, context | Context.AllowPossibleRegEx, Token.TemplateTail);
  return finishNode(state, context, start, line, column, {
    type: 'TemplateElement',
    value: {
      cooked: tokenValue,
      raw: tokenRaw
    },
    tail: true
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
function parseArgumentList(state: ParserState, context: Context): (ESTree.Expression | ESTree.SpreadElement)[] {
  /**
   * ArgumentList
   *
   * AssignmentExpression
   * ...AssignmentExpression
   *
   * ArgumentList, AssignmentExpression
   * ArgumentList, ...AssignmentExpression
   *
   */

  expect(state, context | Context.AllowPossibleRegEx, Token.LeftParen);
  const expressions: (ESTree.Expression | ESTree.SpreadElement)[] = [];
  while (state.token !== Token.RightParen) {
    if (state.token === Token.Ellipsis) {
      expressions.push(parseSpreadElement(state, context, Origin.ArgList));
      if (state.token === <Token>Token.RightParen) break;
      expect(state, context, Token.Comma);
      continue;
    } else {
      expressions.push(secludeGrammar(state, context, 0, parseAssignmentExpression));
    }
    if (!optional(state, context | Context.AllowPossibleRegEx, Token.Comma)) break;
  }

  expect(state, context, Token.RightParen);
  return expressions;
}

function parseSpreadElement(state: ParserState, context: Context, origin: Origin): ESTree.SpreadElement {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  expect(state, context | Context.AllowPossibleRegEx, Token.Ellipsis);
  if (state.token & Token.IsAwait) state.flags = state.flags | Flags.SeenAwait;
  if (origin & Origin.ObjectExpression && (state.token === Token.LeftBracket || state.token === Token.LeftBrace)) {
    // Fixes cases where '{' or '[' directly follows after '...' in object expr. E.g. '({...{a, b}} = x):'
    // This has to be done before we parse out the 'AssignmentExpression' because none
    // of this should be 'bindable' or 'assignable'
    state.bindable = state.assignable = false;
  }
  const argument = acquireGrammar(state, context, 0, parseAssignmentExpression);
  if (origin & ((origin & Origin.ObjectExpression) | Origin.ArrayLiteral)) {
    if (
      argument.type !== 'ArrayExpression' &&
      argument.type !== 'ObjectExpression' &&
      !isValidSimpleAssignmentTarget(argument)
    ) {
      state.bindable = state.assignable = false;
    }
  }
  return finishNode(state, context, start, line, column, {
    type: 'SpreadElement',
    argument
  });
}

function parseAsyncArgument(state: ParserState, context: Context): any {
  const arg = parseAssignmentExpression(state, context);
  state.pendingCoverInitializeError = null;
  return arg;
}

/**
 * Parse new expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NewExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */

function parseNewExpression(state: ParserState, context: Context): ESTree.NewExpression | ESTree.MetaProperty {
  // NewExpression ::
  //   ('new')+ MemberExpression
  //
  // NewTarget ::
  //   'new' '.' 'target'
  //
  // Examples of new expression:
  // - new foo.bar().baz
  // - new foo()()
  // - new new foo()()
  // - new new foo
  // - new new foo()
  // - new new foo().bar().baz
  // - `new.target[await x]`
  // - `new (foo);`
  // - `new (foo)();`
  // - `new foo()();`
  // - `new (await foo);`
  // - `new x(await foo);`
  const { startIndex: start, startLine: line, startColumn: column } = state;
  const id = parseIdentifier(state, context | Context.AllowPossibleRegEx);

  if (optional(state, context, Token.Period)) {
    return (context & Context.AllowNewTarget) < 1 || state.tokenValue !== 'target'
      ? report(state, Errors.Unexpected)
      : parseMetaProperty(state, context, id);
  }

  // Unary expression are forbidden inside 'new', so we create a nice error message here and
  // bail out quick
  if ((state.token & Token.IsUnaryOp) === Token.IsUnaryOp) {
    report(state, Errors.InvalidUnaryWithNew, KeywordDescTable[state.token & Token.Type]);
  }
  const callee =
    state.token === Token.ImportKeyword
      ? parseCallImportOrMetaProperty(state, context, true)
      : secludeGrammarWithLocation(state, context, start, line, column, parseMemberExpressionOrHigher);

  return finishNode(state, context, start, line, column, {
    type: 'NewExpression',
    callee,
    arguments: state.token === Token.LeftParen ? parseArgumentList(state, context) : []
  });
}

function parseMemberExpressionOrHigher(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): any {
  return parseMemberExpression(
    state,
    context,
    start,
    line,
    column,
    parsePrimaryExpression(state, context, start, line, column)
  );
}

export function parseAndClassifyIdentifier(state: ParserState, context: Context) {
  if (
    ((context & Context.Strict) === 0 && state.token === Token.EscapedStrictReserved) ||
    state.token === Token.LetKeyword ||
    state.token === Token.StaticKeyword ||
    state.token === Token.YieldKeyword
  ) {
  }
}

/**
 * Parse primary expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-primary-expression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parsePrimaryExpression(
  state: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): any {
  /**
   *  PrimaryExpression :
   *   1. this
   *   2. IdentifierName
   *   3. Literal
   *   4. ArrayLiteral
   *   5. ObjectLiteral
   *   6. TemplateLiteral
   *   7. ParenthesizedExpression
   *
   * Literal :
   *    NullLiteral
   *    BooleanLiteral
   *    NumericLiteral
   *    StringLiteral
   *
   * ParenthesizedExpression :
   *   ( AssignmentExpression )
   *
   */

  const { token } = state;

  if ((token & Token.IsIdentifier) === Token.IsIdentifier || token === Token.EscapedStrictReserved) {
    return parseIdentifier(state, context | Context.TaggedTemplate);
  }

  if (token & Token.IsAsync) {
    if (lookAheadOrScan(state, context, nextTokenIsFuncKeywordOnSameLine, false)) {
      state.bindable = state.assignable = false;
      return parseFunctionExpression(state, context, 1);
    }
    return parseIdentifier(state, context);
  }

  switch (token) {
    case Token.NumericLiteral:
    case Token.StringLiteral:
      state.bindable = state.assignable = false;
      return parseLiteral(state, context);
    case Token.BigIntLiteral:
      state.bindable = state.assignable = false;
      return parseBigIntLiteral(state, context);
    case Token.RegularExpression:
      state.bindable = state.assignable = false;
      return parseRegExpLiteral(state, context);
    case Token.TrueKeyword:
    case Token.FalseKeyword:
    case Token.NullKeyword:
      state.bindable = state.assignable = false;
      return parseNullOrTrueOrFalseLiteral(state, context);
    case Token.ThisKeyword:
      state.bindable = state.assignable = false;
      return parseThisExpression(state, context);
    case Token.LeftBracket:
      return parseArrayLiteral(state, (context | Context.DisallowInContext) ^ Context.DisallowInContext);
    case Token.LeftParen:
      return parseParenthesizedExpression(state, context);
    case Token.LeftBrace:
      return parseObjectLiteral(
        state,
        (context | Context.DisallowInContext) ^ Context.DisallowInContext,
        -1,
        Type.None
      );
    case Token.FunctionKeyword:
      state.bindable = state.assignable = false;
      return parseFunctionExpression(state, context, 0);
    case Token.ClassKeyword:
      state.bindable = state.assignable = false;
      return parseClassExpression(state, context);
    case Token.TemplateTail:
      state.bindable = state.assignable = false;
      return parseTemplateLiteral(state, context);
    case Token.TemplateCont:
      state.bindable = state.assignable = false;
      return parseTemplate(state, context, start, line, column);
    case Token.NewKeyword:
      state.bindable = state.assignable = false;
      return parseNewExpression(state, context);
    case Token.SuperKeyword:
      state.bindable = state.assignable = false;
      return parseSuperExpression(state, context);
    case Token.PrivateName:
      state.bindable = state.assignable = false;
      return parseIdentifierNameOrPrivateName(state, context);
    case Token.LetKeyword: {
      if (context & Context.Strict) report(state, Errors.UnexpectedStrictReserved);
      const { startIndex: start, startLine: line, startColumn: column } = state;
      scanSingleToken(state, context);
      if (state.flags & Flags.NewLine && (state.token as Token) === Token.LeftBracket) {
        report(state, Errors.RestricedLetProduction);
      }

      return context & Context.OptionsRaw
        ? finishNode(state, context, start, line, column, {
            type: 'Identifier',
            name: 'let',
            raw: 'let'
          })
        : finishNode(state, context, start, line, column, {
            type: 'Identifier',
            name: 'let'
          });
    }
    case Token.DoKeyword:
      return parseDoExpression(state, context);
    case Token.YieldKeyword:
      if (context & (Context.YieldContext | Context.Strict)) {
        report(state, Errors.DisallowedInContext, KeywordDescTable[state.token & Token.Type]);
      }
    // falls through
    default:
      if (isValidIdentifier(context, state.token)) {
        return parseIdentifier(state, context | Context.TaggedTemplate);
      }
      report(
        state,
        state.token === Token.EscapedKeyword || (state.token as Token) === Token.EscapedStrictReserved
          ? Errors.InvalidEscapedKeyword
          : Errors.UnexpectedToken,
        KeywordDescTable[state.token & Token.Type]
      );
  }
}

/**
 * Parse do expression (*experimental*)
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseDoExpression(state: ParserState, context: Context): ESTree.DoExpression {
  // AssignmentExpression ::
  //     do '{' StatementList '}'
  if ((context & Context.OptionsExperimental) < 1) report(state, Errors.NoExperimentalOption);
  const { startIndex: start, startLine: line, startColumn: column } = state;
  expect(state, context, Token.DoKeyword);
  return finishNode(state, context, start, line, column, {
    type: 'DoExpression',
    body: parseBlockStatement(state, context, createScope(ScopeType.BlockStatement))
  });
}
/**
 * Parse array literal expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseArrayLiteral(state: ParserState, context: Context): ESTree.ArrayExpression {
  /**
   * ArrayLiteral :
   *   [ Elision(opt) ]
   *   [ ElementList ]
   *   [ ElementList, Elision(opt) ]
   *
   * ElementList :
   *   Elision(opt) AssignmentExpression
   *   ElementList, Elision(opt) AssignmentExpression
   *
   * Elision :
   *  ,
   *  Elision ,
   *
   * SpreadElement:
   * ...AssignmentExpression
   */
  const { startIndex: start, startLine: line, startColumn: column } = state;
  scanSingleToken(state, context | Context.AllowPossibleRegEx);
  const elements: (ESTree.SpreadElement | ESTree.Expression | null)[] = [];
  while (state.token !== Token.RightBracket) {
    if (optional(state, context, Token.Comma)) {
      elements.push(null);
      if ((state.token as Token) === Token.LeftBracket) {
        break;
      }
    } else if (state.token === Token.Ellipsis) {
      elements.push(parseSpreadElement(state, context, Origin.ArrayLiteral));
      if ((state.token as Token) !== Token.RightBracket) {
        state.bindable = state.assignable = false;
        expect(state, context, Token.Comma);
      }
    } else {
      elements.push(acquireGrammar(state, context, 0, parseAssignmentExpression));
      if (optional(state, context | Context.AllowPossibleRegEx, Token.Comma)) {
        if ((state.token as Token) === Token.RightBracket) {
          break;
        }
      } else {
        break;
      }
    }
  }

  expect(state, context, Token.RightBracket);

  return finishNode(state, context, start, line, column, {
    type: 'ArrayExpression',
    elements
  });
}

/**
 * Parse function expression
 *
 * @param parser Parser object
 * @param context Context masks
 * @param isAsync True if parsing an async func expr
 */
function parseFunctionExpression(state: ParserState, context: Context, isAsync: 0 | 1): ESTree.FunctionExpression {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  expect(state, context, Token.FunctionKeyword);

  const isGenerator = optionalBit(state, context, Token.Multiply);
  const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;

  // Create a new function scope
  let functionScope = createScope(ScopeType.BlockStatement);

  let id: ESTree.Identifier | null = null;
  let firstRestricted: string | undefined;

  if (state.token & Token.IsIdentifier || state.token === Token.EscapedStrictReserved) {
    validateBindingIdentifier(
      state,
      ((context & 0b0000000000000000000_1100_00000000) << 11) | generatorAndAsyncFlags,
      Type.Variable
    );
    recordTokenValueAndDeduplicate(state, context, functionScope, Type.Variable, Origin.None, true, state.tokenValue);
    functionScope = createSubScope(functionScope, ScopeType.BlockStatement);
    firstRestricted = state.tokenValue;
    id = parseIdentifier(state, context);
  }

  context =
    ((context | 0b0000001111011000000_0000_00000000) ^ 0b0000001111011000000_0000_00000000) |
    Context.AllowNewTarget |
    generatorAndAsyncFlags;

  // Create a argument scope
  const paramScoop = createSubScope(functionScope, ScopeType.ArgumentList);

  const params = parseFormalParameters(state, context, paramScoop, Origin.ArgList, Modifiers.None);

  const body: any = parseFunctionBody(
    state,
    (context | Context.InGlobal) ^ Context.InGlobal,
    createSubScope(paramScoop, ScopeType.BlockStatement),
    firstRestricted,
    Origin.None
  );

  return finishNode(state, context, start, line, column, {
    type: 'FunctionExpression',
    params,
    body,
    async: isAsync === 1,
    generator: isGenerator === 1,
    id
  });
}

/**
 * Parse arrow function expression
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope object
 * @param params Argument list params
 * @param isAsync True if parsing an async func expr
 */
function parseArrowFunctionExpression(
  state: ParserState,
  context: Context,
  scope: ScopeState,
  params: any,
  isAsync: 0 | 1,
  start: number,
  line: number,
  column: number,
  type: Type
): ESTree.ArrowFunctionExpression {
  if (state.flags & Flags.NewLine) report(state, Errors.InvalidLineBreak, '=>');

  if (type & Type.ConciseBody) {
    expect(state, context | Context.AllowPossibleRegEx, Token.Arrow);
  } else {
    expect(state, context, Token.Arrow);
    for (let i = 0; i < params.length; ++i) {
      reinterpret(state, params[i]);
    }
    if (checkIfLexicalAlreadyBound(state, context, scope, Origin.None, true)) {
      report(state, Errors.AlreadyDeclared, 'function argument');
    }
  }

  context = ((context | 0b0000000111100000000_0000_00000000) ^ 0b0000000111100000000_0000_00000000) | (isAsync << 22);

  const expression = state.token !== Token.LeftBrace;
  const body = expression
    ? secludeGrammar(state, context, 0, parseAssignmentExpression)
    : parseFunctionBody(
        state,
        (context | 0b0001000000000000001_0000_00000000) ^ 0b0001000000000000001_0000_00000000,
        createSubScope(scope, ScopeType.BlockStatement),
        state.tokenValue,
        Origin.Arrow
      );
  return finishNode(state, context, start, line, column, {
    type: 'ArrowFunctionExpression',
    body,
    params,
    id: null,
    async: isAsync === 1,
    expression
  });
}

/**
 * Parse parenthesized expression
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseParenthesizedExpression(state: ParserState, context: Context): any {
  state.flags = (state.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;
  expect(state, context | Context.AllowPossibleRegEx, Token.LeftParen);
  const scope = createScope(ScopeType.ArgumentList);
  context |= Context.ParentheziedContext;
  if (optional(state, context, Token.RightParen)) {
    if (state.token !== <Token>Token.Arrow) report(state, Errors.Unexpected);
    state.assignable = state.bindable = false;
    return {
      type: Arrows.Plain,
      scope,
      params: []
    };
  } else if (state.token === Token.Ellipsis) {
    state.flags |= Flags.SimpleParameterList;
    const rest = parseRestElement(state, context, scope, Type.ArgList, Origin.None);
    expect(state, context, Token.RightParen);
    if (state.token !== <Token>Token.Arrow) report(state, Errors.Unexpected);
    state.assignable = state.bindable = false;
    return {
      type: Arrows.Plain,
      scope,
      params: [rest]
    };
  }

  let pState = ParenthesizedState.None;

  state.bindable = true;

  const { token, startIndex: start, startLine: line, startColumn: column } = state;

  if (token === Token.LeftBrace || token === Token.LeftBracket) state.flags |= Flags.SimpleParameterList;

  if ((token & Token.FutureReserved) === Token.FutureReserved || (token & Token.IsYield) === Token.IsYield) {
    if ((token & Token.IsYield) === Token.IsYield) state.flags = state.flags | Flags.SeenYield;
    pState = pState | ParenthesizedState.ReservedWords;
  } else if ((token & Token.IsAwait) === Token.IsAwait) {
    state.flags = state.flags | Flags.SeenAwait;
  }

  if ((token as Token) === Token.Identifier) {
    recordTokenValue(state, context, scope, Type.ArgList, Origin.None, 0, false, state.tokenValue);
  }

  let expr = acquireGrammar(
    state,
    (context | Context.DisallowInContext) ^ Context.DisallowInContext,
    0,
    parseAssignmentExpression
  );

  if (state.token === Token.Comma) {
    state.assignable = false;
    pState = pState | ParenthesizedState.SequenceExpression;
    const params: (ESTree.Expression | ESTree.RestElement)[] = [expr];

    while (optional(state, context | Context.AllowPossibleRegEx, Token.Comma)) {
      if (optional(state, context, Token.RightParen)) {
        if (state.token !== <Token>Token.Arrow) report(state, Errors.Unexpected);
        state.assignable = false;
        return {
          type: Arrows.Plain,
          scope,
          params: params
        };
      }

      state.assignable = false;

      if (state.token === <Token>Token.Ellipsis) {
        if (!state.bindable) report(state, Errors.InvalidDestructExpr);
        state.flags = state.flags | Flags.SimpleParameterList;
        const restElement = parseRestElement(state, context, scope, Type.ArgList, Origin.None);
        expect(state, context, Token.RightParen);
        if (state.token !== <Token>Token.Arrow)
          report(state, Errors.UnexpectedToken, KeywordDescTable[state.token & Token.Type]);
        state.bindable = false;
        params.push(restElement);
        return {
          type: Arrows.Plain,
          scope,
          params: params
        };
      } else if (optional(state, context, Token.RightParen)) {
        if (state.token !== <Token>Token.Arrow)
          report(state, Errors.UnexpectedToken, KeywordDescTable[state.token & Token.Type]);
        return {
          type: Arrows.Plain,
          scope,
          params: params
        };
      } else {
        if ((state.token as Token) === Token.LeftBrace || (state.token as Token) === Token.LeftBracket) {
          state.flags = state.flags | Flags.SimpleParameterList;
        }
        if (
          (state.token & Token.FutureReserved) === Token.FutureReserved ||
          (state.token & Token.IsYield) === Token.IsYield
        ) {
          state.flags = state.flags | Flags.SeenYield;
          pState = pState | ParenthesizedState.ReservedWords;
        } else if ((state.token & Token.IsAwait) === Token.IsAwait) {
          state.flags = state.flags | Flags.SeenAwait;
        }

        if ((state.token as Token) === Token.Identifier) {
          recordTokenValue(state, context, scope, Type.ArgList, Origin.None, 0, false, state.tokenValue);
        }
        params.push(
          acquireGrammar(
            state,
            (context | Context.DisallowInContext) ^ Context.DisallowInContext,
            0,
            parseAssignmentExpression
          )
        );
      }
    }
    expr = finishNode(state, context, start, line, column, {
      type: 'SequenceExpression',
      expressions: params
    } as any);
  }

  expect(state, context, Token.RightParen);

  if (state.token === <Token>Token.Arrow) {
    if (!state.bindable) report(state, Errors.InvalidLHSOfError);

    if (pState & ParenthesizedState.ReservedWords) {
      if (context & Context.Strict) report(state, Errors.UnexpectedStrictReserved);
      state.flags = state.flags | Flags.HasStrictReserved;
    } else if (context & (Context.Strict | Context.YieldContext) && state.flags & Flags.SeenYield) {
      report(state, Errors.YieldInParameter);
    } else if (context & (Context.Module | Context.AwaitContext) && state.flags & Flags.SeenAwait) {
      report(state, Errors.AwaitInParameter);
    }

    state.flags = (state.flags | Flags.SeenYield | Flags.SeenAwait) ^ (Flags.SeenYield | Flags.SeenAwait);

    state.assignable = state.bindable = false;
    return {
      type: Arrows.Plain,
      scope,
      params: pState & ParenthesizedState.SequenceExpression ? expr.expressions : [expr],
      async: false
    };
  }

  state.bindable = false;

  context = (context | Context.ParentheziedContext) ^ Context.ParentheziedContext;

  state.flags =
    (state.flags | Flags.SeenYield | Flags.SeenAwait | Flags.SimpleParameterList) ^
    (Flags.SeenYield | Flags.SeenAwait | Flags.SimpleParameterList);

  if (!isValidSimpleAssignmentTarget(expr)) state.assignable = false;

  return context & Context.OptionsParenthesized
    ? finishNode(state, context, start, line, column, {
        type: 'ParenthesizedExpression',
        expression: expr
      } as any)
    : expr;
}

/**
 * Parses class expression
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope object
 */
function parseClassExpression(state: ParserState, context: Context): ESTree.ClassExpression {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  scanSingleToken(state, context);
  context = (context | Context.Strict | Context.InConstructor) ^ Context.InConstructor;
  let id: ESTree.Expression | null = null;
  let superClass: ESTree.Expression | null = null;
  if (state.token & Token.IsIdentifier && state.token !== Token.ExtendsKeyword) {
    validateBindingIdentifier(state, context, Type.ClassExprDecl);
    recordTokenValue(state, context, -1, Type.Let, Origin.None, 0, false, state.tokenValue);
    id = parseIdentifier(state, context);
  }

  if (optional(state, context | Context.AllowPossibleRegEx, Token.ExtendsKeyword)) {
    superClass = secludeGrammarWithLocation(state, context, start, line, column, parseLeftHandSideExpression);
    context |= Context.SuperCall;
  } else context = (context | Context.SuperCall) ^ Context.SuperCall;

  const body = parseClassBodyAndElementList(state, context, Origin.None);

  return finishNode(state, context, start, line, column, {
    type: 'ClassExpression',
    id,
    superClass,
    body
  });
}

export function parseClassBodyAndElementList(state: ParserState, context: Context, origin: Origin): ESTree.ClassBody {
  const { startIndex: start, startLine: line, startColumn: column } = state;
  expect(state, context | Context.AllowPossibleRegEx, Token.LeftBrace);
  const body: ESTree.MethodDefinition[] = [];

  while (state.token !== Token.RightBrace) {
    if (!optional(state, context, Token.Semicolon)) {
      body.push(parseClassElementList(state, context, Modifiers.None));
    }
  }

  expect(state, origin & Origin.Declaration ? context | Context.AllowPossibleRegEx : context, Token.RightBrace);

  state.flags = (state.flags | Flags.HasConstructor) ^ Flags.HasConstructor;

  return finishNode(state, context, start, line, column, {
    type: 'ClassBody',
    body
  });
}

function parseClassElementList(state: ParserState, context: Context, modifier: Modifiers): ESTree.MethodDefinition {
  let key: ESTree.Identifier | ESTree.Literal | ESTree.Expression | void;
  let { token, tokenValue, startIndex: start, startLine: line, startColumn: column } = state;

  if (state.token & Token.IsIdentifier) {
    key = parseIdentifier(state, context);
    switch (token) {
      // 'static'
      case Token.StaticKeyword:
        if ((modifier & Modifiers.Static) === 0 && state.token !== Token.LeftParen) {
          return parseClassElementList(state, context, Modifiers.Static);
        }
        break;
      // 'async'
      case Token.AsyncKeyword:
        if (state.token !== Token.LeftParen && (state.flags & Flags.NewLine) === 0) {
          if (optional(state, context, Token.Multiply)) modifier |= Modifiers.Generator;
          tokenValue = state.tokenValue;
          if (state.token & Token.IsIdentifier) {
            if (state.flags & Flags.NewLine) report(state, Errors.InvalidLineBreak, 'async');
            key = parseIdentifier(state, context);
          } else if (state.token === Token.NumericLiteral || state.token === Token.StringLiteral) {
            key = parseLiteral(state, context);
          } else if (state.token === Token.LeftBracket) {
            modifier |= Modifiers.Computed;
            key = parseComputedPropertyName(state, context);
          } else {
            report(state, Errors.Unexpected);
          }
          modifier |= Modifiers.Async;
        }
        break;
      // 'get'
      case Token.GetKeyword:
        if (state.token !== Token.LeftParen) {
          tokenValue = state.tokenValue;
          if (state.token & Token.IsIdentifier) {
            key = parseIdentifier(state, context);
          } else if (state.token === Token.NumericLiteral || state.token === Token.StringLiteral) {
            key = parseLiteral(state, context);
          } else if (state.token === Token.LeftBracket) {
            modifier |= Modifiers.Computed;
            key = parseComputedPropertyName(state, context);
          } else if (state.token === <Token>Token.EscapedStrictReserved) {
            key = parseIdentifier(state, context);
          } else {
            report(state, Errors.Unexpected);
          }
          modifier |= Modifiers.Getter;
        }
        break;
      // 'set'
      case Token.SetKeyword:
        if (state.token !== Token.LeftParen) {
          tokenValue = state.tokenValue;
          if (state.token & Token.IsIdentifier) {
            key = parseIdentifier(state, context);
          } else if (state.token === Token.NumericLiteral || state.token === Token.StringLiteral) {
            key = parseLiteral(state, context);
          } else if (state.token === Token.LeftBracket) {
            modifier |= Modifiers.Computed;
            key = parseComputedPropertyName(state, context);
          } else if (state.token === <Token>Token.EscapedStrictReserved) {
            key = parseIdentifier(state, context);
          } else {
            report(state, Errors.Unexpected);
          }
          modifier |= Modifiers.Setter;
        }
        break;
      default: // ignore
    }
  } else if (state.token === Token.LeftBracket) {
    modifier |= Modifiers.Computed;
    key = parseComputedPropertyName(state, context);
  } else if (state.token === Token.NumericLiteral || state.token === Token.StringLiteral) {
    if (state.tokenValue === 'constructor') modifier |= Modifiers.Constructor;
    key = parseLiteral(state, context);
  } else if (state.token === Token.Multiply) {
    scanSingleToken(state, context);
    tokenValue = state.tokenValue;
    if (state.token & Token.IsIdentifier) {
      key = parseIdentifier(state, context);
    } else if (state.token === <Token>Token.NumericLiteral || state.token === <Token>Token.StringLiteral) {
      key = parseLiteral(state, context);
    } else if (state.token === <Token>Token.LeftBracket) {
      modifier |= Modifiers.Computed;
      key = parseComputedPropertyName(state, context);
    } else if (state.token === <Token>Token.EscapedStrictReserved) {
      key = parseIdentifier(state, context);
    } else {
      report(state, Errors.Unexpected);
    }

    modifier |= Modifiers.Generator;
  } else if (state.token === Token.Semicolon) {
    scanSingleToken(state, context);
  } else if (state.token === <Token>Token.EscapedStrictReserved) {
    key = parseIdentifier(state, context);
  } else {
    report(state, Errors.UnexpectedToken, KeywordDescTable[state.token & Token.Type]);
  }

  if (
    (modifier & Modifiers.Computed) === 0 &&
    modifier & (Modifiers.Static | Modifiers.Async | Modifiers.GetSet) &&
    state.tokenValue === 'prototype'
  ) {
    report(state, Errors.StaticPrototype);
  }

  if (tokenValue === 'constructor') {
    if ((modifier & Modifiers.Static) === 0) {
      if (modifier & (Modifiers.GetSet | Modifiers.Async | Modifiers.Generator))
        report(state, Errors.InvalidConstructor, 'accessor');
      if ((context & Context.SuperCall) === 0 && (modifier & Modifiers.Computed) === 0) {
        if (state.flags & Flags.HasConstructor) report(state, Errors.DuplicateConstructor);
        else state.flags |= Flags.HasConstructor;
      }
    }
    modifier |= Modifiers.Constructor;
  }

  if (state.token !== Token.LeftParen) report(state, Errors.Expected, '(');

  return finishNode(state, context, start, line, column, {
    type: 'MethodDefinition',
    kind:
      (modifier & Modifiers.Static) === 0 && modifier & Modifiers.Constructor
        ? 'constructor'
        : modifier & Modifiers.Getter
        ? 'get'
        : modifier & Modifiers.Setter
        ? 'set'
        : 'method',
    static: (modifier & Modifiers.Static) !== 0,
    computed: (modifier & Modifiers.Computed) !== 0,
    key,
    value: parseMethodDeclaration(state, context, modifier)
  } as any);
}

/**
 * Parses object literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Literal)
 *
 * @param state Parser object
 * @param context Context masks
 * @param scope Scope object
 * @param type Binding type
 */

function parseObjectLiteral(
  state: ParserState,
  context: Context,
  scope: ScopeState | number,
  type: Type
): ESTree.Expression {
  /**
   *
   * ObjectLiteral :
   *   { }
   *   { PropertyDefinitionList }
   *
   * PropertyDefinitionList :
   *   PropertyDefinition
   *   PropertyDefinitionList, PropertyDefinition
   *
   * PropertyDefinition :
   *   IdentifierName
   *   PropertyName : AssignmentExpression
   *
   * PropertyName :
   *   IdentifierName
   *   StringLiteral
   *   NumericLiteral
   */
  const { startIndex: start, startLine: line, startColumn: column } = state;
  scanSingleToken(state, context);
  let key: ESTree.Expression | null = null;
  let token = state.token;
  let tokenValue = state.tokenValue;
  let value: any;
  let hasProto = false;
  const properties: any[] = [];

  let objState = Modifiers.None;

  const { assignable, bindable, pendingCoverInitializeError } = state;

  state.bindable = state.assignable = true;
  state.pendingCoverInitializeError = null;

  while (state.token !== Token.RightBrace) {
    if (state.token === <Token>Token.Ellipsis) {
      properties.push(parseSpreadElement(state, context, Origin.ObjectExpression));
    } else {
      const { startIndex: objStart, startLine: objLine, startColumn: objColumn } = state;
      objState = Modifiers.None;
      if (
        state.token & Token.IsIdentifier ||
        state.token === Token.EscapedKeyword ||
        state.token === Token.EscapedStrictReserved
      ) {
        token = state.token;
        tokenValue = state.tokenValue;
        objState = Modifiers.None;
        key = parseIdentifier(state, context);
        const newLine = (state.flags & Flags.NewLine) > 0;
        if (
          state.token === <Token>Token.Comma ||
          state.token === <Token>Token.RightBrace ||
          state.token === <Token>Token.Assign
        ) {
          objState |= Modifiers.Shorthand;

          if (tokenValue !== 'eval' || tokenValue !== 'arguments')
            validateBindingIdentifier(state, context, type, token);
          recordTokenValue(state, context, scope, type, Origin.None, 0, false, tokenValue);

          if (state.token === <Token>Token.Assign) {
            state.pendingCoverInitializeError = Errors.InvalidCoverInitializedName;
            expect(state, context, Token.Assign);
            value = parseAssignmentPattern(state, context, key, objStart, objLine, objColumn);
          } else {
            value = key;
          }
        } else if (optional(state, context | Context.AllowPossibleRegEx, Token.Colon)) {
          if (tokenValue === '__proto__') {
            if (hasProto) {
              // Record the error and put it on hold until we've determined
              // whether or not we're destructuring
              state.pendingCoverInitializeError = Errors.InvalidCoverInitializedName;
              // setPendingExpressionError(parser, Errors.DuplicateProto);
            } else hasProto = true;
          }
          if (context & Context.ParentheziedContext) {
            if ((state.token & Token.IsAwait) === Token.IsAwait) {
              state.flags = state.flags | Flags.SeenAwait;
            } else if ((state.token & Token.IsYield) === Token.IsYield) {
              state.flags = state.flags | Flags.SeenYield;
            }
          }

          value = acquireGrammar(state, context, 0, parseAssignmentExpression);
        } else if (state.token === <Token>Token.LeftBracket) {
          key = parseComputedPropertyName(state, context);
          if (token === <Token>Token.AsyncKeyword) {
            if (newLine) report(state, Errors.InvalidLineBreak, 'async');
            objState |= Modifiers.Async | Modifiers.Computed | Modifiers.Method;
          } else {
            if (token === Token.GetKeyword) objState = (objState & ~Modifiers.Setter) | Modifiers.Getter;
            else if ((token & Token.SetKeyword) === Token.SetKeyword)
              objState = (objState & ~Modifiers.Getter) | Modifiers.Setter;
            objState |= Modifiers.Computed & ~Modifiers.Method;
          }

          if (state.token !== <Token>Token.LeftParen) report(state, Errors.Unexpected);
          state.bindable = state.assignable = false;
          value = parseMethodDeclaration(state, context, objState);
        } else if (state.token === <Token>Token.LeftParen) {
          objState = objState | (Modifiers.Method & ~(Modifiers.Async | Modifiers.Generator));
          state.bindable = state.assignable = false;
          value = parseMethodDeclaration(state, context, objState);
        } else {
          if (optional(state, context, Token.Multiply)) objState |= Modifiers.Generator;

          if ((state.token & Token.IsIdentifier) > 0) {
            key = parseIdentifier(state, context);
            if (state.token !== <Token>Token.LeftParen) report(state, Errors.Unexpected);
            if (token === <Token>Token.AsyncKeyword) {
              if (newLine) report(state, Errors.InvalidLineBreak, 'async');
              objState |= Modifiers.Async | Modifiers.Method;
            } else if (token === <Token>Token.GetKeyword) {
              objState = (objState & ~Modifiers.Setter) | Modifiers.Getter;
            } else if (token === <Token>Token.SetKeyword) {
              objState = (objState & ~Modifiers.Getter) | Modifiers.Setter;
            }
            state.bindable = state.assignable = false;
            value = parseMethodDeclaration(state, context, objState);
          } else if (state.token === <Token>Token.NumericLiteral || state.token === <Token>Token.StringLiteral) {
            key = parseLiteral(state, context);
            if (state.token !== <Token>Token.LeftParen) report(state, Errors.Unexpected);
            if (token === <Token>Token.AsyncKeyword) {
              if (newLine) report(state, Errors.InvalidLineBreak, 'async');
              objState |= Modifiers.Async | Modifiers.Method;
            } else if (token === <Token>Token.GetKeyword) {
              objState = (objState & ~Modifiers.Setter) | Modifiers.Getter;
            } else if (token === <Token>Token.SetKeyword) {
              objState = (objState & ~Modifiers.Getter) | Modifiers.Setter;
            }
            state.bindable = state.assignable = false;
            value = parseMethodDeclaration(state, context, objState);
          } else if (state.token === <Token>Token.LeftBracket) {
            if (token === <Token>Token.AsyncKeyword) {
              if (newLine) report(state, Errors.InvalidLineBreak, 'async');
              objState |= Modifiers.Async | Modifiers.Method;
            } else if (token === <Token>Token.GetKeyword) {
              objState = (objState & ~Modifiers.Setter) | Modifiers.Getter;
            } else if (token === <Token>Token.SetKeyword) {
              objState = (objState & ~Modifiers.Getter) | Modifiers.Setter;
            }
            key = parseComputedPropertyName(state, context);
            value = parseMethodDeclaration(state, context, objState);
          }
        }
      } else if (state.token === <Token>Token.NumericLiteral || state.token === <Token>Token.StringLiteral) {
        tokenValue = state.tokenValue;
        key = parseLiteral(state, context);

        if (state.token === <Token>Token.Assign) report(state, Errors.InvalidAssignmentTarget);

        if (optional(state, context | Context.AllowPossibleRegEx, Token.Colon)) {
          if (tokenValue === '__proto__') {
            if (hasProto) {
              state.pendingCoverInitializeError = Errors.InvalidCoverInitializedName;
            } else hasProto = true;
          }
          value = acquireGrammar(
            state,
            (context | Context.DisallowInContext) ^ Context.DisallowInContext,
            0,
            parseAssignmentExpression
          );
        } else {
          state.bindable = state.assignable = false;
          value = parseMethodDeclaration(state, context, objState);
          objState |= Modifiers.Method;
        }
      } else if (state.token === <Token>Token.LeftBracket) {
        key = parseComputedPropertyName(state, context);
        objState = (objState & ~(Modifiers.Async | Modifiers.Generator | Modifiers.GetSet)) | Modifiers.Computed;
        if (state.token === <Token>Token.Colon) {
          scanSingleToken(state, context);
          value = parseAssignmentExpression(state, context);
        } else {
          objState |= Modifiers.Method;
          if (state.token !== <Token>Token.LeftParen) report(state, Errors.Expected, '(');
          state.bindable = state.assignable = false;
          value = parseMethodDeclaration(state, context, objState);
        }
      } else if (state.token & Token.Multiply) {
        scanSingleToken(state, context);
        if (state.token & Token.IsIdentifier) {
          token = state.token;
          objState &= ~(Modifiers.Method | Modifiers.Async);
          key = parseIdentifier(state, context);
          if (state.token === <Token>Token.LeftParen) {
            state.bindable = state.assignable = false;
            value = parseMethodDeclaration(state, context, objState | Modifiers.Generator);
            objState |= Modifiers.Method | Modifiers.Generator;
          } else {
            if (token === <Token>Token.AsyncKeyword) report(state, Errors.Unexpected);
            if (token === Token.GetKeyword || (token & Token.SetKeyword) === Token.SetKeyword)
              report(state, Errors.Unexpected);
            if (token === <Token>Token.Colon) report(state, Errors.Unexpected);
            report(state, Errors.Unexpected);
          }
        } else if (state.token === <Token>Token.NumericLiteral || state.token === <Token>Token.StringLiteral) {
          key = parseLiteral(state, context);
          state.bindable = state.assignable = false;
          value = parseMethodDeclaration(state, context, objState | Modifiers.Generator);
          objState |= Modifiers.Method;
        } else if (state.token === <Token>Token.LeftBracket) {
          key = parseComputedPropertyName(state, context);
          state.bindable = state.assignable = false;
          value = parseMethodDeclaration(state, context, objState | Modifiers.Generator);
          objState |= Modifiers.Method | Modifiers.Computed;
        } else {
          report(state, Errors.UnexpectedToken, KeywordDescTable[state.token & Token.Type]);
        }
      } else {
        report(state, Errors.UnexpectedToken, KeywordDescTable[state.token & Token.Type]);
      }

      properties.push(
        finishNode(state, context, objStart, objLine, objColumn, {
          type: 'Property',
          key,
          value,
          kind: !(objState & Modifiers.GetSet) ? 'init' : objState & Modifiers.Setter ? 'set' : 'get',
          computed: (objState & Modifiers.Computed) > 0,
          method: (objState & Modifiers.Method) > 0,
          shorthand: (objState & Modifiers.Shorthand) > 0
        } as any)
      );
    }
    optional(state, context, Token.Comma);
  }

  expect(state, context, Token.RightBrace);
  state.flags = (state.flags | Flags.SeenPrototype) ^ Flags.SeenPrototype;
  state.bindable = state.bindable && bindable;
  state.assignable = state.assignable && assignable;
  state.pendingCoverInitializeError = pendingCoverInitializeError || state.pendingCoverInitializeError;

  return finishNode(state, context, start, line, column, {
    type: 'ObjectExpression',
    properties
  });
}

function parseMethodDeclaration(state: ParserState, context: Context, objState: Modifiers): any {
  const { assignable, bindable, pendingCoverInitializeError } = state;
  state.assignable = state.bindable = false;
  state.bindable = state.assignable = true;
  state.pendingCoverInitializeError = null;
  const result = parsePropertyMethod(state, context | Context.InMethod, objState);
  if (state.pendingCoverInitializeError !== null) {
    report(state, Errors.UnexpectedToken, KeywordDescTable[(state.token, Token.Type)]);
  }

  state.bindable = bindable;
  state.assignable = assignable;
  state.pendingCoverInitializeError = pendingCoverInitializeError;

  return result;
}

function parsePropertyMethod(state: ParserState, context: Context, objState: Modifiers): ESTree.FunctionExpression {
  // Create a new function scope
  const functionScope = createScope(ScopeType.BlockStatement);
  const { startIndex: start, startLine: line, startColumn: column } = state;

  const modifierFlags =
    (objState & Modifiers.Constructor) === 0
      ? 0b0000001111010000000_0000_00000000
      : 0b0000000111000000000_0000_00000000;

  context =
    ((context | modifierFlags) ^ modifierFlags) |
    ((objState & 0b0000000000000000000_0000_01011000) << 18) |
    0b0000110000001000000_0000_00000000;
  // Create a argument scope
  const paramScoop = createSubScope(functionScope, ScopeType.ArgumentList);

  const params = parseFormalParameters(state, context, paramScoop, Origin.ArgList, objState);

  const body: any = parseFunctionBody(
    state,
    (context | Context.InGlobal) ^ Context.InGlobal,
    createSubScope(paramScoop, ScopeType.BlockStatement),
    void 0,
    Origin.None
  );
  return finishNode(state, context, start, line, column, {
    type: 'FunctionExpression',
    params,
    body,
    async: (objState & Modifiers.Async) > 0,
    generator: (objState & Modifiers.Generator) > 0,
    id: null
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
export function parseLiteral(state: ParserState, context: Context): ESTree.Literal {
  const { tokenRaw: raw, tokenValue: value, startIndex, startLine, startColumn } = state;
  if (context & Context.Strict && state.flags & Flags.Octal) report(state, Errors.StrictOctalLiteral);
  scanSingleToken(state, context);
  return context & Context.OptionsRaw
    ? finishNode(state, context, startIndex, startLine, startColumn, {
        type: 'Literal',
        value,
        raw
      })
    : finishNode(state, context, startIndex, startLine, startColumn, {
        type: 'Literal',
        value
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
export function parseNullOrTrueOrFalseLiteral(state: ParserState, context: Context): ESTree.Literal {
  const { token, startIndex, startLine, startColumn } = state;
  const raw = KeywordDescTable[token & Token.Type];
  const value = token === Token.NullKeyword ? null : raw === 'true';
  scanSingleToken(state, context);
  return context & Context.OptionsRaw
    ? finishNode(state, context, startIndex, startLine, startColumn, {
        type: 'Literal',
        value,
        raw
      })
    : finishNode(state, context, startIndex, startLine, startColumn, {
        type: 'Literal',
        value
      });
}

export function parseThisExpression(state: ParserState, context: Context): ESTree.ThisExpression {
  const { startIndex, startLine, startColumn } = state;
  scanSingleToken(state, context);
  return finishNode(state, context, startIndex, startLine, startColumn, {
    type: 'ThisExpression'
  });
}

export function parseIdentifier(state: ParserState, context: Context): ESTree.Identifier {
  const { tokenRaw: raw, tokenValue: name, startIndex, startLine, startColumn } = state;
  scanSingleToken(state, context);

  return context & Context.OptionsRaw
    ? finishNode(state, context, startIndex, startLine, startColumn, {
        type: 'Identifier',
        name,
        raw
      })
    : finishNode(state, context, startIndex, startLine, startColumn, {
        type: 'Identifier',
        name
      });
}

/**
 * Parse regular expression literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals)
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseRegExpLiteral(state: ParserState, context: Context): ESTree.RegExpLiteral {
  const { tokenRegExp: regex, tokenValue: value, startIndex: start, startLine: line, startColumn: column } = state;
  scanSingleToken(state, context);
  return finishNode(state, context, start, line, column, {
    type: 'Literal',
    value,
    regex
  });
}

/**
 * Parses BigInt literal (stage 4 proposal)
 *
 * @see [Link](https://tc39.github.io/proposal-bigint/)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBigIntLiteral(state: ParserState, context: Context): ESTree.BigIntLiteral {
  const { tokenRaw: raw, tokenValue: value, startIndex: start, startLine: line, startColumn: column } = state;
  scanSingleToken(state, context);
  return finishNode(state, context, start, line, column, {
    type: 'Literal',
    value,
    bigint: raw,
    raw
  });
}

/**
 * Parse computed property names
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ComputedPropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function parseComputedPropertyName(state: ParserState, context: Context): ESTree.Expression {
  expect(state, context | Context.AllowPossibleRegEx, Token.LeftBracket);
  const key: ESTree.Expression = secludeGrammar(
    state,
    (context | Context.DisallowInContext) ^ Context.DisallowInContext,
    0,
    parseAssignmentExpression
  );
  expect(state, context, Token.RightBracket);
  return key;
}
