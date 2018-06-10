import * as t from 'assert';
import { nextToken } from '../../src/lexer/scan';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

describe('Lexer - Punctuators', () => {

    // Punctuators

    const punctuators: [Context, Token, string][] = [
        /* Punctuators */
        [Context.Empty, Token.Arrow, '=>'],
        [Context.Empty, Token.LeftParen, '('],
        [Context.Empty, Token.LeftBrace, '{'],
        [Context.Empty, Token.Period, '.'],
        [Context.Empty, Token.Ellipsis, '...'],
        [Context.Empty, Token.RightBrace, '}'],
        [Context.Empty, Token.RightParen, ')'],
        [Context.Empty, Token.Semicolon, ';'],
        [Context.Empty, Token.Comma, ','],
        [Context.Empty, Token.LeftBracket, '['],
        [Context.Empty, Token.RightBracket, ']'],
        [Context.Empty, Token.Colon, ':'],
        [Context.Empty, Token.QuestionMark, '?'],
        [Context.OptionsJSX, Token.JSXClose, '</'],
        [Context.OptionsJSX, Token.JSXAutoClose, '/>'],
        [Context.Empty, Token.Increment, '++'],
        [Context.Empty, Token.Decrement, '--'],
        [Context.Empty, Token.Assign, '='],
        [Context.Empty, Token.ShiftLeftAssign, '<<='],
        [Context.Empty, Token.ShiftRightAssign, '>>='],
        [Context.Empty, Token.LogicalShiftRightAssign, '>>>='],
        [Context.Empty, Token.ExponentiateAssign, '**='],
        [Context.Empty, Token.AddAssign, '+='],
        [Context.Empty, Token.SubtractAssign, '-='],
        [Context.Empty, Token.MultiplyAssign, '*='],
        [Context.Empty, Token.DivideAssign, '/='],
        [Context.Empty, Token.ModuloAssign, '%='],
        [Context.Empty, Token.BitwiseXorAssign, '^='],
        [Context.Empty, Token.BitwiseOrAssign, '|='],
        [Context.Empty, Token.BitwiseAndAssign, '&='],
        [Context.Empty, Token.Negate, '!'],
        [Context.Empty, Token.Complement, '~'],
        [Context.Empty, Token.Add, '+'],
        [Context.Empty, Token.Subtract, '-'],
        [Context.Empty, Token.Multiply, '*'],
        [Context.Empty, Token.Modulo, '%'],
        [Context.Empty, Token.Divide, '/'],
        [Context.Empty, Token.Exponentiate, '**'],
        [Context.Empty, Token.LogicalAnd, '&&'],
        [Context.Empty, Token.LogicalOr, '||'],
        [Context.Empty, Token.StrictEqual, '==='],
        [Context.Empty, Token.StrictNotEqual, '!=='],
        [Context.Empty, Token.LooseEqual, '=='],
        [Context.Empty, Token.LooseNotEqual, '!='],
        [Context.Empty, Token.LessThanOrEqual, '<='],
        [Context.Empty, Token.GreaterThanOrEqual, '>='],
        [Context.Empty, Token.LessThan, '<'],
        [Context.Empty, Token.GreaterThan, '>'],
        [Context.Empty, Token.ShiftLeft, '<<'],
        [Context.Empty, Token.ShiftRight, '>>'],
        [Context.Empty, Token.LogicalShiftRight, '>>>'],
        [Context.Empty, Token.BitwiseAnd, '&'],
        [Context.Empty, Token.BitwiseOr, '|'],
        [Context.Empty, Token.BitwiseXor, '^'],
    ];

    for (const [context, token, op] of punctuators) {
        it(`should scan '${op}' punctuator`, () => {
            const parser = createParserObject(op, undefined);
            const punctuator = nextToken(parser, context);
            t.deepEqual({
                token: tokenDesc(punctuator),
                punctuator: (token & Token.Punctuator) === Token.Punctuator,
                line: parser.line,
                column: parser.column,
            }, {
                token: tokenDesc(token),
                punctuator: true,
                line: 1,
                column: op.length,
            });
        });
    }
});
