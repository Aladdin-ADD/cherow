import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Expressions - Conditional', () => {

    describe('Pass', () => {

        const validSyntax = [
            '(delete O.p) ** 10',
            '(delete x) ** 10',
            '(~O.p) ** 10',
            '(~x) ** 10',
            '(!O.p) ** 10',
            '(!x) ** 10',
            '(+O.p) ** 10',
            '(+x) ** 10',
            '(-O.p) ** 10',
            'x ** y ** z',
            '++x ** y',
            '(-x) ** y',
            '-(x ** y)',
            '(-x) ** 10',
            '(typeof O.p) ** 10',
            '(typeof x) ** 10',
            '(void 0) ** 10',
            '(void O.p) ** 10',
            '(void x) ** 10',
            '++O.p ** 10',
            '++x ** 10',
            '--O.p ** 10',
            '--x ** 10',
            'O.p++ ** 10',
            'x++ ** 10',
            'O.p-- ** 10',
            'x-- ** 10',
        ];
        for (const arg of validSyntax) {

            it(`var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, () => {
                t.doesNotThrow(() => {
                    parseSource(`var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, undefined, Context.OptionsNext | Context.Module);
                });
            });

            it(`var O = { p: 1 }, x = 10; ; (${arg})`, () => {
                t.doesNotThrow(() => {
                    parseSource(`var O = { p: 1 }, x = 10; ; (${arg})`, undefined, Context.OptionsNext | Context.Module);
                });
            });

            it(`var O = { p: 1 }, x = 10; foo(${arg})`, () => {
                t.doesNotThrow(() => {
                    parseSource(`var O = { p: 1 }, x = 10; foo(${arg})`, undefined, Context.OptionsNext | Context.Module);
                });
            });

        }
    });
});