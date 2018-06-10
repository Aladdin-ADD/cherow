import * as t from 'assert';
import { nextToken } from '../../src/lexer/scan';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

describe('Lexer - Numbers', () => {

    describe("Pass", () => {

        const inputData: any = [
            [Context.Empty, '0', 0, Token.NumericLiteral],
            [Context.Empty, '1', 1, Token.NumericLiteral],
            [Context.Empty, '123', 123, Token.NumericLiteral],
            [Context.Empty, '1.34', 1.34, Token.NumericLiteral],
            [Context.Empty, '1.', 1, Token.NumericLiteral],
            [Context.Empty, '12345678912345678912345678123456789258721349812657123641237846', 1.2345678912345679e+61, Token.NumericLiteral],
            [Context.Empty, '0.E1', 0, Token.NumericLiteral],
            [Context.Empty, '134e44', 1.34e+46, Token.NumericLiteral],
            [Context.Empty, '7.E1', 70, Token.NumericLiteral],
            [Context.Empty, '0.8', 0.8, Token.NumericLiteral],
            [Context.Empty, '7.E1', 70, Token.NumericLiteral],
            [Context.Empty, '6.', 6, Token.NumericLiteral],
            [Context.Empty, '3.14159', 3.14159, Token.NumericLiteral],
            [Context.Empty, '6.02214179e+23', 6.02214179e+23, Token.NumericLiteral],
            [Context.Empty, '1.492417830e-10', 1.49241783e-10, Token.NumericLiteral],
            [Context.Empty, '0e+100', 0, Token.NumericLiteral],
            [Context.Empty, '1.34', 1.34, Token.NumericLiteral],
            [Context.Empty, '.44', 0.44, Token.NumericLiteral],

            // Binary

            [Context.Empty, '0b10', 2, Token.NumericLiteral],
            [Context.Empty, '0B011', 3, Token.NumericLiteral],
            [Context.Empty, '0B010', 2, Token.NumericLiteral],
            [Context.Empty, '0B0', 0, Token.NumericLiteral],
            [Context.Empty, '0b10', 2, Token.NumericLiteral],
            [Context.Empty, '0B010', 2, Token.NumericLiteral],
            [Context.Empty, '0b0101011', 43, Token.NumericLiteral],
            [Context.Empty, '0b010101101011', 1387, Token.NumericLiteral],
            [Context.Empty, '0b01010110101111010111101011', 22738411, Token.NumericLiteral],
            [Context.Empty, '0b01010110101101101011110101111010111010111101011', 47671431493099, Token.NumericLiteral],

            // Hex
            [Context.Empty, '0x10', 16, Token.NumericLiteral],
            [Context.Empty, '0x100', 256, Token.NumericLiteral],
            [Context.Empty, '0xabc', 2748, Token.NumericLiteral],
            [Context.Empty, '0xdef', 3567, Token.NumericLiteral],
            [Context.Empty, '0X04', 4, Token.NumericLiteral],
            [Context.Empty, '0X1A', 26, Token.NumericLiteral],
            [Context.Empty, '0x1000', 4096, Token.NumericLiteral],
            [Context.Empty, '0x10000000', 268435456, Token.NumericLiteral],
            [Context.Empty, '0x100000000000', 17592186044416, Token.NumericLiteral],
            [Context.Empty, '0x100000000000', 17592186044416, Token.NumericLiteral],
            [Context.Empty, '0x10EF399d', 284113309, Token.NumericLiteral],
            [Context.Empty, '0x10E00FFFEEEAAAF399d', 4.98069295632166e+21, Token.NumericLiteral],

            // Implicit octals

            [Context.Empty, '001234', 668, Token.NumericLiteral],
            [Context.Empty, '0564', 372, Token.NumericLiteral],
            [Context.Empty, '012', 10, Token.NumericLiteral],
            [Context.Empty, '0012', 10, Token.NumericLiteral],
            [Context.Empty, '0.', 0, Token.NumericLiteral],
            [Context.Empty, '0789', 789, Token.NumericLiteral],
            [Context.Empty, '00009', 9, Token.NumericLiteral],
            [Context.Empty, '00008', 8, Token.NumericLiteral],
            [Context.Empty, '00008.1', 8.1, Token.NumericLiteral],
            [Context.Empty, '00009.1', 9.1, Token.NumericLiteral],
            [Context.Empty, '00009.1E2-1', 910, Token.NumericLiteral],
            [Context.Empty, '018', 18, Token.NumericLiteral],

            // Octals
            [Context.Empty, '0o0', 0, Token.NumericLiteral],
            [Context.Empty, '0o1', 1, Token.NumericLiteral],
            [Context.Empty, '0O077', 63, Token.NumericLiteral],
            [Context.Empty, '0o7', 7, Token.NumericLiteral],
            [Context.Empty, '0o011', 9, Token.NumericLiteral],
            [Context.Empty, '0O077', 63, Token.NumericLiteral],
            // BigInt
            [Context.OptionsNext, '123n', 123, Token.BigInt],

            // Numeric separators - hex
            //[Context.OptionsNext, '0x10n', 16, Token.BigInt],

            // Numeric separators - octal
            [Context.OptionsNext, '0o7n', 7, Token.BigInt],
            [Context.OptionsNext, '0O077n', 63, Token.BigInt],
        ];

        for (const [ctx, source, parsed, token] of inputData) {
            it(`scans '${source}'`, () => {
                const parser = createParserObject(source, undefined);
                const found = nextToken(parser, ctx);

                t.deepEqual({
                    value: parser.tokenValue,
                    line: parser.line,
                }, {
                    value: parsed,
                    line: 1,
                });
            });
        }
    });
});
