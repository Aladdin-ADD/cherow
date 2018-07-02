import * as t from 'assert';
import {Token, tokenDesc, descKeywordTable} from "../src/token";

describe("src/tokens", () => {
    describe("tokenDesc(), descKeywordTable()", () => {
        const items: [Token, string][] = [
            [Token.Increment, '++'],
            [Token.Decrement, '--'],
            [Token.Assign, '='],
            [Token.ShiftLeftAssign, '<<='],
            [Token.ShiftRightAssign, '>>='],
            [Token.LogicalShiftRightAssign, '>>>='],
            [Token.ExponentiateAssign, '**='],
            [Token.AddAssign, '+='],
            [Token.SubtractAssign, '-='],
            [Token.MultiplyAssign, '*='],
            [Token.DivideAssign, '/='],
            [Token.ModuloAssign, '%='],
            [Token.BitwiseXorAssign, '^='],
            [Token.BitwiseOrAssign, '|='],
            [Token.BitwiseAndAssign, '&='],
            [Token.TypeofKeyword, 'typeof'],
            [Token.DeleteKeyword, 'delete'],
            [Token.VoidKeyword, 'void'],
            [Token.Negate, '!'],
            [Token.Complement, '~'],
            [Token.Add, '+'],
            [Token.Subtract, '-'],
            [Token.InKeyword, 'in'],
            [Token.InstanceofKeyword, 'instanceof'],
            [Token.Multiply, '*'],
            [Token.Modulo, '%'],
            [Token.Divide, '/'],
            [Token.Exponentiate, '**'],
            [Token.LogicalAnd, '&&'],
            [Token.LogicalOr, '||'],
            [Token.StrictEqual, '==='],
            [Token.StrictNotEqual, '!=='],
            [Token.LooseEqual, '=='],
            [Token.LooseNotEqual, '!='],
            [Token.LessThanOrEqual, '<='],
            [Token.GreaterThanOrEqual, '>='],
            [Token.LessThan, '<'],
            [Token.GreaterThan, '>'],
            [Token.ShiftLeft, '<<'],
            [Token.ShiftRight, '>>'],
            [Token.LogicalShiftRight, '>>>'],
            [Token.BitwiseAnd, '&'],
            [Token.BitwiseOr, '|'],
            [Token.BitwiseXor, '^'],
            [Token.VarKeyword, 'var'],
            [Token.LetKeyword, 'let'],
            [Token.ConstKeyword, 'const'],
            [Token.BreakKeyword, 'break'],
            [Token.CaseKeyword, 'case'],
            [Token.CatchKeyword, 'catch'],
            [Token.ClassKeyword, 'class'],
            [Token.ContinueKeyword, 'continue'],
            [Token.DebuggerKeyword, 'debugger'],
            [Token.DefaultKeyword, 'default'],
            [Token.DoKeyword, 'do'],
            [Token.ElseKeyword, 'else'],
            [Token.ExportKeyword, 'export'],
            [Token.ExtendsKeyword, 'extends'],
            [Token.FinallyKeyword, 'finally'],
            [Token.ForKeyword, 'for'],
            [Token.FunctionKeyword, 'function'],
            [Token.IfKeyword, 'if'],
            [Token.ImportKeyword, 'import'],
            [Token.NewKeyword, 'new'],
            [Token.ReturnKeyword, 'return'],
            [Token.SuperKeyword, 'super'],
            [Token.SwitchKeyword, 'switch'],
            [Token.ThisKeyword, 'this'],
            [Token.ThrowKeyword, 'throw'],
            [Token.TryKeyword, 'try'],
            [Token.WhileKeyword, 'while'],
            [Token.WithKeyword, 'with'],
        ]

        for (const [token, expected] of items) {
            it(`should stringify '${expected}' token`, () => {
                t.equal(tokenDesc(token), expected)
            })

            if (!/^\w+$/.test(expected)) continue
        }
    })
})
