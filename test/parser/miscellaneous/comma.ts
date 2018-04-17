import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/utilities';
import * as t from 'assert';
import { parse } from '../../../src/parser/parser';

describe('Failure', () => {

    const invalidSyntax = [
        ',',
        ',,',
        ',,,',
        'ice,',
        'ice, fapper,,,',
        'function ("foo",") {}',
        ' function  a(b,,) {}',
        ' function* a(b,,) {}',
        '(function  a(b,,) {});',
        '(function* a(b,,) {});',
        '(function   (b,,) {});',
        '(function*  (b,,) {});',
        ' function  a(b,c,d,,) {}',
        ' function* a(b,c,d,,) {}',
        '(function  a(b,c,d,,) {});',
        '(function* a(b,c,d,,) {});',
        '(function   (b,c,d,,) {});',
        '(function*  (b,c,d,,) {});',
        '(b,,) => {};',
        '(b,c,d,,) => {};',
        'a(1,,);',
        'a(1,2,3,,);',
        ' function  a1(,) {}',
        ' function* a2(,) {}',
        '(function  a3(,) {});',
        '(function* a4(,) {});',
        '(function    (,) {});',
        '(function*   (,) {});',
        '(,) => {};',
        'a1(,);',
        ' function  a(...b,) {}',
        ' function* a(...b,) {}',
        '(function  a(...b,) {});',
        '(function* a(...b,) {});',
        '(function   (...b,) {});',
        '(function*  (...b,) {});',
        ' function  a(b, c, ...d,) {}',
        ' function* a(b, c, ...d,) {}',
        '(function  a(b, c, ...d,) {});',
        '(function* a(b, c, ...d,) {});',
        '(function   (b, c, ...d,) {});',
        '(function*  (b, c, ...d,) {});',
        '(...b,) => {};',
        '(b, c, ...d,) => {};',
        '(,);',
        '(a,);',
        '(a,b,c,);',
        'n, op, val,',
        'foo(a,,) => 0',
        'async (a,,) => 0',
        'foo (,) => 0',
        ', => 0',
        ', () => 0',
        'async (,) => 0',
    ];

    for (const arg of invalidSyntax) {

        it(`${arg}`, () => {
            t.throws(() => {
                parse(`${arg}`, undefined, Context.Empty);
            });
        });

        it(`"use strict"; ${arg}`, () => {
            t.throws(() => {
                parse(`"use strict"; ${arg}`, undefined, Context.Empty);
            });
        });

        it(`function foo() {${arg}}`, () => {
            t.throws(() => {
                parse(`function foo() {${arg}}`, undefined, Context.Empty);
            });
        });

        it(`function foo() {'use strict'; ${arg}}`, () => {
            t.throws(() => {
                parse(`function foo() {'use strict'; ${arg}}`, undefined, Context.Empty);
            });
        });
    }
});

describe('Pass', () => {

    const validSyntax = [
        ' function  a(b,) {}',
        ' function* a(b,) {}',
        '(function  a(b,) {});',
        '(function* a(b,) {});',
        '(function   (b,) {});',
        '(function*  (b,) {});',
        ' function  a(b,c,d,) {}',
        ' function* a(b,c,d,) {}',
        '(function  a(b,c,d,) {});',
        '(function* a(b,c,d,) {});',
        '(function   (b,c,d,) {});',
        '(function*  (b,c,d,) {});',
        'class Foo { bar(a,) { } }',
        '(1, y)',
        '0, f(n - 1);',
        '(b,) => {};',
        '(b,c,d,) => {};',
        'a(1,);',
        'a(1,2,3,);',
        'a(...[],);',
        'a(1, 2, ...[],);',
        'a(...[], 2, ...[],);',
        'a, b => 0',
        'a, b, (c, d) => 0',
        '(a, b, (c, d) => 0)',
        '(a, b) => 0, (c, d) => 1',
        '(a, b => {}, a => a + 1)',
        '((a, b) => {}, (a => a + 1))',
        '(a, (a, (b, c) => 0))',
        'async (a, (a, (b, c) => 0))',
        '[...a,]',
        '[...a, ,]',
        '[, ...a]',
        '[...[...a]]',
        '[, ...a]',
        '[, , ...a]',
    ];

    for (const arg of validSyntax) {

        it(`${arg}`, () => {
            t.doesNotThrow(() => {
                parse(`${arg}`, undefined, Context.Empty);
            });
        });

        it(`"use strict"; ${arg}`, () => {
            t.doesNotThrow(() => {
                parse(`"use strict"; ${arg}`, undefined, Context.Empty);
            });
        });

        it(`function foo() {${arg}}`, () => {
            t.doesNotThrow(() => {
                parse(`function foo() {${arg}}`, undefined, Context.Empty);
            });
        });

        it(`function foo() {'use strict'; ${arg}}`, () => {
            t.doesNotThrow(() => {
                parse(`function foo() {'use strict'; ${arg}}`, undefined, Context.Empty);
            });
        });
    }
});