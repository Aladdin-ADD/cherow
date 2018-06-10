import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Statements - If', () => {

    const invalidSyntax = [
        'if (a) b()',
        'if (a) (function(){})',
        'if (a) var x = 0;',
        'if (a) b(); else c()',
        'if(a)b',
        'if(a)b;else c;',
        'function f() { if (1) { return () => { while (true) hi(); } } }',
        'if (1) { eval(42) }',
        'if (true) if (false) {} else ; else {}',
    ];

    for (const arg of invalidSyntax) {
        it(`${arg}`, () => {
            t.doesNotThrow(() => {
                parseSource(`${arg}`, undefined, Context.Empty);
            });
        });

        it(`${arg}`, () => {
            t.doesNotThrow(() => {
                parseSource(`${arg}`, undefined, Context.Empty);
            });
        });
    }

});