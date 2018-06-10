import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Expressions - Call', () => {

    describe('Pass', () => {

        const asyncCallEdgeCases = [
            'async', // Async identifier
            'async()',
            'async(async(async(async(async(async())))))', // Nested
            'async(a)(b)',
            'async(a)(s)(y)(n)(c)',
            'async() => {}', // async arrow
            'async()()',
            'async()(async() => {})',
        ];

        for (const arg of asyncCallEdgeCases) {

            it(`function fn() { 'use strict';} fn(${arg});`, () => {
                t.doesNotThrow(() => {
                    parseSource(`function fn() { 'use strict';} fn(${arg});`, undefined, Context.Empty);
                });
            });
        }

        const spreadCall = [
            `a()(a)`,
            `async()()`,
            `async(a)()`,
            `async()(b)`,
            `async(a)(b)`,
            '...([1, 2, 3])',
            '...\'123\', ...\'456\'',
            '...new Set([1, 2, 3]), 4',
            '1, ...[2, 3], 4',
            '...Array(...[1,2,3,4])',
            '...NaN',
            '0, 1, ...[2, 3, 4], 5, 6, 7, ...\'89\'',
            '0, 1, ...[2, 3, 4], 5, 6, 7, ...\'89\', 10',
            '...[0, 1, 2], 3, 4, 5, 6, ...\'7\', 8, 9',
            '...[0, 1, 2], 3, 4, 5, 6, ...\'7\', 8, 9, ...[10]',
        ];

        for (const arg of spreadCall) {

            it(`function fn() { 'use strict';} fn(${arg});`, () => {
                t.doesNotThrow(() => {
                    parseSource(`function fn() { 'use strict';} fn(${arg});`, undefined, Context.Empty);
                });
            });

            it(`function fn() { } fn(${arg});`, () => {
                t.doesNotThrow(() => {
                    parseSource(`function fn() { } fn(${arg});`, undefined, Context.Empty);
                });
            });
        }

        const validSyntax = [
            'foo(...[],);',
            '(function(obj) {}(1, 2, 3, ...[]));',
            'foo(x=1,y=x,x+y)',
            'foo(x,x=1);',
            'a.b( o.bar );',
            'a.b( o["bar"] );',
            'a.b( foo() );',
            'a.b.c( foo() );',
            'a.b( foo() );',
            'a.b( c() ).d;',
            'eval(...{}, "x = 0;");',
            'foo()(1, 2, 3, ...{})',
            'foo(...[],)',
            '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
            'a.b( c() ).d.e;',
            'f();',
            'g(a);',
            'h(a, b);',
            'i(a, b, ...c);',
            'j(...a);',
            'a.k();',
            '(a + b).l();',
            'a.m().n();',
            'new A();',
            'new A(a);',
            'new a.B();',
            'new a.b.C();',
            'new (a().B)();',
            'new A().b();',
            'new new A()();',
            'new (A, B)();',
            'a.b( c() ).d.e((a)).f.g',
            'a.b( c() ).d.e((a = 123)).f.g',
            '(function(obj) {}({a: 1, b: 2, ...null}));',
            '(function(obj) {}({a: 1, b: 2, ...null}));',
            '(function(obj) {}({a: 1, b: 2, ...null}));',
            '(function(obj) {}({...{b: 2}, a: 3}));',
            '(function(obj) {}({...{a: 2, b: 3, c: 4, e: undefined, f: null, g: false}, a: 1, b: 7, d: 5, h: -0, i: Symbol(\'foo\'), j: {a: 2, b: 3, c: 4, e: undefined, f: null, g: false}}));',
            '(function(obj) {}({...undefined}));',
            '(function(obj) {}(...target = [2, 3, 4]));',
        ];

        for (const arg of validSyntax) {

            it(`"use strict"; ${arg}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`"use strict"; ${arg}`, undefined, Context.Empty);
                });
            });
        }

    });  
});