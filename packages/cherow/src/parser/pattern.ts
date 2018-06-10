import { Parser } from '../types';
import { Token, tokenDesc } from '../token';
import * as ESTree from '../estree';
import { Errors, recordErrors, } from '../errors';
import { parseVariableDeclaration } from './declarations';
import { parseComputedPropertyName, parseAssignmentExpression,
} from './expressions';
import {
    Context,
    Flags,
    BindingType,
    BindingOrigin,
    consume,
    expect,
    nextToken,
    isInOrOf,
    BindingKind,
    swapFlags
} from '../common';

/**
 * Parse binding identifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BindingIdentifier)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBindingIdentifier(
    parser: Parser,
    context: Context,
    kind: BindingKind = BindingKind.Var
): ESTree.Identifier {
    const { token: t } = parser;

    if ((t & Token.Contextual) === Token.Contextual) {
        if (parser.token === Token.AwaitKeyword) {
            if ((context & Context.Strict) === Context.Strict) recordErrors(parser, context, Errors.Unexpected);
            if ((context & Context.Async) === Context.Async) recordErrors(parser, context, Errors.Unexpected);
        }
        if (t === Token.AsyncKeyword) {}
        if (kind === BindingKind.Var) {}
    } else if (t === Token.Eval || t === Token.Arguments) {
        if ((context & Context.Strict) === Context.Strict) recordErrors(parser, context, Errors.Unexpected);
        parser.flags |= Flags.StrictEvalArguments;
    } else if ((t & Token.FutureReserved) === Token.FutureReserved) {
        if ((context & Context.Strict) === Context.Strict) recordErrors(parser, context, Errors.Unexpected);
        parser.flags |= Flags.StrictReserved;
    } else if ((t & Token.Reserved) === Token.Reserved) {
        recordErrors(parser, context, Errors.Unexpected);
    }

    const name = parser.tokenValue;
    nextToken(parser, context);
    return {
        type: 'Identifier',
        name
    };
}

/**
 * Parses either a binding identifier or binding pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBindingIdentifierOrPattern(
    parser: Parser,
    context: Context,
    type ?: BindingType
): any {
    if (parser.token === Token.LeftBrace) {
        return parserObjectAssignmentPattern(parser, context, type as BindingType);
    } else if (parser.token === Token.LeftBracket) {
        return parseArrayAssignmentPattern(parser, context, type as BindingType);
    }
    return parseBindingIdentifier(parser, context);
}

/**
 * Parse assignment rest element
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentRestElement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseAssignmentRestElement(
    parser: Parser,
    context: Context,
    type: BindingType,
    endToken: Token = Token.RightBracket): ESTree.RestElement {
    const t = type; // TODO
    expect(parser, context, Token.Ellipsis);
    const argument = parseBindingIdentifierOrPattern(parser, context);
    if (parser.token === Token.Assign) recordErrors(parser, context, Errors.ElementAfterRest);
    if (parser.token !== endToken) recordErrors(parser, context, Errors.ElementAfterRest);
    return {
        type: 'RestElement',
        argument,
    };
}

/**
 * Parses array assignment pattern
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayAssignmentPattern)
 *
 * @param Parser object
 * @param Context masks
 */
function parseArrayAssignmentPattern(parser: Parser, context: Context, type: BindingType): any {
    // ArrayAssignmentPattern[Yield] :
    //   [ Elisionopt AssignmentRestElement[?Yield]opt ]
    //   [ AssignmentElementList[?Yield] ]
    //   [ AssignmentElementList[?Yield] , Elisionopt AssignmentRestElement[?Yield]opt ]
    //
    // AssignmentRestElement[Yield] :
    //   ... DestructuringAssignmentTarget[?Yield]
    //
    // AssignmentElementList[Yield] :
    //   AssignmentElisionElement[?Yield]
    //   AssignmentElementList[?Yield] , AssignmentElisionElement[?Yield]
    //
    // AssignmentElisionElement[Yield] :
    //   Elisionopt AssignmentElement[?Yield]
    //
    // AssignmentElement[Yield] :
    //   DestructuringAssignmentTarget[?Yield] Initializer[In,?Yield]opt
    //
    // DestructuringAssignmentTarget[Yield] :
    //   LeftHandSideExpression[?Yield]
    //
    expect(parser, context, Token.LeftBracket);
    const elements: (ESTree.Node | null)[] = [];
    while (parser.token !== Token.RightBracket) {
        if (consume(parser, context, Token.Comma)) {
            elements.push(null);
        } else {
            if (parser.token === Token.Ellipsis) {
                elements.push(parseAssignmentRestElement(parser, context, type));
                break;
            } else {
                elements.push(parseBindingInitializer(parser, context, type));
            }
            if (parser.token !== Token.RightBracket) expect(parser, context, Token.Comma);
        }
    }

    expect(parser, context, Token.RightBracket);

    // tslint:disable-next-line:no-object-literal-type-assertion
    return {
        type: 'ArrayPattern',
        elements,
    };
}

/** Parse assignment pattern
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentPattern)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayAssignmentPattern)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param left LHS of assignment pattern
 * @param pos Location
 */
export function parseAssignmentPattern(
    parser: Parser,
    context: Context,
    left: ESTree.PatternTop,
): ESTree.AssignmentPattern {
    return {
        type: 'AssignmentPattern',
        left,
        right: parseAssignmentExpression(parser, context),
    };
}

/**
 * Parse binding initializer
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentPattern)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayAssignmentPattern)
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseBindingInitializer(
    parser: Parser,
    context: Context,
    type: BindingType
): any {
    const left: any = parseBindingIdentifierOrPattern(parser, context, type);
    return !consume(parser, context, Token.Assign) ?
        left : {
            type: 'AssignmentPattern',
            left,
            right: parseAssignmentExpression(parser, context),
        };
}

/**
 * Parse rest property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentRestProperty)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
// tslint:disable-next-line:function-name
function parseAssignmentRestProperty(parser: Parser, context: Context): any {
    expect(parser, context, Token.Ellipsis);
    const { token } = parser;
    const argument = parseBindingIdentifierOrPattern(parser, context);
    return {
        type: 'RestElement',
        argument,
    };
}

/**
 * Parse object assignment pattern
 *
 * @param Parser Parser object
 * @param Context Context masks
 */
function parserObjectAssignmentPattern(parser: Parser, context: Context, type: BindingType): ESTree.ObjectPattern {
    const properties: (ESTree.AssignmentProperty | ESTree.RestElement)[] = [];
    expect(parser, context, Token.LeftBrace);

    while (parser.token !== Token.RightBrace) {
        if (parser.token === Token.Ellipsis) {
            properties.push(parseAssignmentRestProperty(parser, context));
            break;
        }
        properties.push(parseAssignmentProperty(parser, context, type));
        if (parser.token !== Token.RightBrace) expect(parser, context, Token.Comma);
    }

    expect(parser, context, Token.RightBrace);

    return {
        type: 'ObjectPattern',
        properties,
    };
}

/**
 * Parse assignment property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentProperty)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseAssignmentProperty(parser: Parser, context: Context, type: BindingType): any {
    const { token } = parser;
    let key: ESTree.Literal | ESTree.Identifier | ESTree.Expression | null = null;
    let value;
    const computed = parser.token === Token.LeftBracket;
    let shorthand = false;
    // single name binding
    if (token & (Token.Identifier | Token.Reserved | Token.FutureReserved)) {
        key = parseBindingIdentifier(parser, context);
        shorthand = !consume(parser, context, Token.Colon);
        if (shorthand) {
            const hasInitializer = consume(parser, context, Token.Assign);
            value = hasInitializer ? parseAssignmentPattern(parser, context, key) : key;
        } else value = parseBindingInitializer(parser, context, type);
    } else {
        key = parseComputedPropertyName(parser, context);
        expect(parser, context, Token.Colon);
        value = parseBindingInitializer(parser, context, type);
    }

    return {
        type: 'Property',
        kind: 'init',
        key,
        computed,
        value,
        method: false,
        shorthand,
    };
}

/**
 * Parses a delimited binding list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BindingList)
 * @see [Link](https://tc39.github.io/ecma262/#prod-FormalParameterList)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Catch)
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-statement)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param type Binding type
 * @param origin Binding origin
 */

export function parseDelimitedBindingList(
    parser: Parser,
    context: Context,
    type: BindingType,
    origin: BindingOrigin,
    args: any[] = []) {
    let elementCount = 0;
    const inited = false;
    const isBinding = parser.token === Token.LeftBrace || parser.token === Token.LeftBracket;
    while (parser.token !== Token.RightParen) {
        ++elementCount;
        args.push(parseBindingList(parser, context, type, origin));
        if (!consume(parser, context, Token.Comma)) break;
    }

    if (origin & BindingOrigin.ForStatement) {
        if (isBinding) {
            if (elementCount > 1) {
                // TODO
            } else if (inited) {
                // TODO
            }
        }
    }
    return args;
}

/**
 * Parse binding list elements
 *
 * @param parser Parser object
 * @param context Context masks
 * @param type Binding type
 * @param origin Binding origin
 */
function parseBindingList(
    parser: Parser,
    context: Context,
    type: BindingType,
    origin: BindingOrigin
): any {
    let left: any;
    if ((parser.token & Token.Identifier) === Token.Identifier) {
        left = parseBindingIdentifier(parser, context);
    } else if (parser.token === Token.LeftBrace || parser.token === Token.LeftBracket) {
        parser.flags |= Flags.SimpleParameterList;
        left = parser.token === Token.LeftBrace ?
            parserObjectAssignmentPattern(parser, context, type) :
            parseArrayAssignmentPattern(parser, context, type);
        if (parser.token !== Token.Assign) {
            if (origin & BindingOrigin.ForStatement && isInOrOf(parser)) {} else if (origin & (BindingOrigin.FunctionArgs | BindingOrigin.CatchClause)) {} else {
                recordErrors(parser, context, Errors.DeclarationMissingInitializer);
            }
        }
    } else if (parser.token === Token.Ellipsis) {
        return parseAssignmentRestElement(parser, context, type, Token.RightParen);
    } else if (parser.token !== Token.RightParen) {
        recordErrors(parser, context, Errors.UnexpectedToken, tokenDesc(parser.token));
    }

    if (parser.token !== Token.Assign) return type & BindingType.Variable ?
        parseVariableDeclaration(left, null) : left;
    nextToken(parser, context);
    parser.flags |= Flags.SimpleParameterList;
    return type & BindingType.Variable ?
        parseVariableDeclaration(left, parseAssignmentExpression(parser, context)) :
        parseAssignmentPattern(parser, context, left);
}
