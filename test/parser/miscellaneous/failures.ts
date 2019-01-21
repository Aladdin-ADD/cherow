import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Miscellaneous - Failurea', () => {
  const inValids: Array<[string, Context]> = [
    ['function*g() { var yield; }', Context.Empty],
    ['(class {[3]:0})', Context.Empty],
    ['(function ({e: a.b}) {})', Context.Empty],
    ['yield 10', Context.Empty],
    ['�!', Context.Empty],
    ['try { }', Context.Empty],
    ['0B1a', Context.Empty],
    ['function t(true) { }', Context.Empty],
    ['0o9', Context.Empty],
    ['0B', Context.Empty],
    ['function test_func() { "use strict"; interface; }', Context.Empty],
    ['function test_func() { "use strict"; package; }', Context.Empty],
    ['function test_func() { "use strict"; static }', Context.Empty],
    ['function test_func() { "use strict"; yield; }', Context.Empty],
    ['function test_func() { "use strict"; let; }', Context.Empty],
    ['async function f(){    (fail = class A extends await foo {}) => fail    }', Context.Empty],
    ['s = {"foo": null = x} = x', Context.Empty],

    ['s = {"foo": this = x} = x', Context.Empty],
    ['s = {"foo": super = x} = x', Context.Empty],
    //['s = {"foo": yield = x} = x', Context.Empty],
    // ['s = {"foo": yield /fail/g = x} = x', Context.Empty],
    ['function *g() {   s = {"foo": yield /brains/ = x} = x   }', Context.Empty],
    //['async function g() {   s = {"foo": await a = x} = x   }', Context.Empty],
    ['arguments--;', Context.Strict],
    ['eval--;', Context.Strict],
    ['--arguments;', Context.Strict],
    ['try {} catch (e) { for (var e of y) {} }', Context.Empty],
    ['function f(){ let x; var x; }', Context.Empty],
    ['o = {f(b, a, b, a, [fine]) {}}', Context.Empty],
    ['o = {f(b, a, b, a = x) {}}', Context.Empty],
    ['o = {f(b, a, b, ...a) {}}', Context.Empty],
    ['o = {f([a, b, a]) {}}', Context.Empty],
    ['o = {f([b, a, a]) {}}', Context.Empty],
    ['o = {f([b, a], ...b) {}}', Context.Empty],
    ['o = {f(){ let x; function x(){} }}', Context.Empty],
    ['class o {f(x) { const x = y }}', Context.Empty],
    ['class o {f(b, a, a) {}}', Context.Empty],
    ['class o {f(a, a, b) {}}', Context.Empty],
    ['class o {f(b, a, b, a = x) {}}', Context.Empty],
    ['class o {f(b, a, b, ...a) {}}', Context.Empty],
    ['class o {f([b, a], b=x) {}}', Context.Empty],
    ['class o {f([b, a], ...b) {}}', Context.Empty],
    ['class o {f(){ const x = y; var x; }}', Context.Empty],
    ['class o {f(){ function x(){} const x = y; }}', Context.Empty],
    ['var x = a; let x = b;', Context.Empty],

    ['const x = a; const x = b;', Context.Empty],
    ['{ function f(){} function f(){} }', Context.OptionsDisableWebCompat],
    ['class o {f(){ function x(){} const x = y; }}', Context.Empty],
    ['var x = a; let x = b;', Context.Empty],
    ['class o {f([b, a], ...b) {}}', Context.Empty],
    ['class o {f(){ const x = y; var x; }}', Context.Empty],
    ['class o {f(){ function x(){} const x = y; }}', Context.Empty],
    ['var x = a; let x = b;', Context.Empty],
    ['class o {f([b, a], ...b) {}}', Context.Empty],
    ['class o {f(){ const x = y; var x; }}', Context.Empty],
    ['class o {f(){ function x(){} const x = y; }}', Context.Empty],
    ['var x = a; let x = b;', Context.Empty],
    ['class o {f(b, a, b, a, [fine]) {}}', Context.Empty],

    ['switch (x) { case a: const foo = x; break; case b: let foo; break; }', Context.Empty],
    ['switch (x) { case a: const foo = x; break; case b: const foo = x; break; }', Context.Empty],
    ['switch (x) { case a: var foo = x; break; case b: const foo = x; break; }', Context.Empty],
    ['switch (x) {case a: function f(){}; break; case b: let f; break; }', Context.Empty],
    ['switch (x) {case a: const f = x; break; case b: function f(){}; break; }', Context.Empty],
    ['var x = a; const x = b;', Context.Empty],
    ['switch (x) { case a: const foo = x; break; case b: let foo; break; }', Context.Empty],
    ['({[foo]: bar()} = baz)', Context.Empty],
    //        ['({[foo]: a + b} = baz)', Context.Empty],
    ['({[foo]: bar()}) => baz', Context.Empty],
    //['({[foo]: a + b}) => baz', Context.Empty],
    ['let {[foo]: bar()} = baz', Context.Empty],
    ['let {[foo]: a + b} = baz', Context.Empty],
    ['try { } catch (implements) {} }', Context.Empty],
    ['try { } catch (yield) {} }', Context.Empty],
    ['"use strict"; function foo(bar, implements) {}', Context.Empty],
    // ['function foo(bar, implements) { "use strict";  }', Context.Empty],
    //['result = [...{ x = yield }] = y;', Context.Empty],
    [`[true = x]`, Context.Empty],
    [`[this=x]`, Context.Empty],
    [`[this]=x`, Context.Empty],
    ['var eval; () => { try { } catch (super) { } }', Context.Empty],
    ['var eval; () => { bar, super) => { } }', Context.Empty],
    ['var eval; () => { try { } catch (super) { } }', Context.Empty],
    ['var eval; () => { ++super; }', Context.Empty],

    ['{function f() {} ; function f() {} }', Context.OptionsDisableWebCompat],
    ['class x {foo}', Context.OptionsDisableWebCompat],

    ['for (const let;;);', Context.Empty],
    ['for (let [a, let] = x;;);', Context.Empty],
    ['for (let [let = y] = x;;);', Context.Empty],
    ['for (let [let] = x;;);', Context.Empty],
    ['let {let = y} = x;', Context.Empty],
    ['let {let} = x;', Context.Empty],
    ['let [a, let] = x;', Context.Empty],
    ['let [let] = x;', Context.Empty],
    ['let o = {true, false, super, this, null};', Context.Empty],
    //[ 'async ({} + 1) => x;', Context.Empty],
    ['const a, [...x] = y', Context.Empty],
    ['const ...x = y', Context.Empty],
    //    [    'export let {...x} = y', Context.Module],
    //    ['({"x": 600..xyz}) => x', Context.Empty],
    ['({"x": 600}) => x', Context.Empty],
    ['({"x": 600} = x)', Context.Empty],
    ['wrap({"a"}=obj);', Context.Empty],

    // ['({"x": y+z} = x)', Context.Empty],
    // ['({"x": y+z}) => x', Context.Empty],

    ['({x: this}) => null', Context.Empty],
    // ['({x: throw}) => null', Context.Strict],
    ['({x: typeof}) => null', Context.Empty],
    ['({x: null}) => null', Context.Empty],
    ['({x: const}) => null', Context.Strict],
    // ['({x: enum}) => null', Context.Strict],
    ['({x:let}) => null', Context.Strict],
    //    ['({ident: [foo, bar] += x})', Context.Empty],
    ['({ident: [foo, bar].join("")}) => x', Context.Empty],
    //     ['({ident: [foo, bar]/x}) => x', Context.Empty],
    // ['({ident: [foo, bar]/x/g}) => x', Context.Empty],
    ['let {[x]} = z;', Context.Empty],
    ['let {[x]};', Context.Empty],
    ['let {[x] = y} = z;', Context.Empty],
    ['for (let {a:=c} = z;;);', Context.Empty],
    ['for (let {[x]};;);', Context.Empty],
    ['for (let {a:=c} = z);', Context.Empty],
    ['for (let {[x]} = z);', Context.Empty],
    ['for (let {[x]});', Context.Empty],
    ['for (let {[x] = y} = z);', Context.Empty],
    ['for (let {a:=c} in z);', Context.Empty],
    ['for (let {[x]} in obj);', Context.Empty],
    ['for (let {[x] = y} in obj);', Context.Empty],
    ['for (let {a:=c} of z);', Context.Empty],
    ['for (let {[x]} of obj);', Context.Empty],
    ['for (let {[x] = y} of obj);', Context.Empty],
    ['export let {a:=c} = z;', Context.Module],
    ['export let {[x]} = z;', Context.Module],
    ['export let {[x]};', Context.Module],
    ['export let {[x] = y} = z;', Context.Empty],
    ['var {a:=c} = z;', Context.Empty],
    ['var {[x]} = z;', Context.Empty],
    ['var {[x]};', Context.Empty],
    ['var {[x] = y} = z;', Context.Empty],

    ['for (var {a:=c} = z;;);', Context.Empty],
    ['for (var {[x]} = z;;);', Context.Empty],
    ['for (var {[x]};;);', Context.Empty],
    ['for (var {[x] = y} = z;;);', Context.Empty],
    ['for (var {a:=c} = z);', Context.Empty],
    ['for (var {[x]} = z);', Context.Empty],
    ['for (var {[x]});', Context.Empty],
    ['for (var {[x] = y} = z);', Context.Empty],
    ['for (var {[x] = y} in obj);', Context.Empty],
    ['for (var {a:=c} of z);', Context.Empty],
    ['for (var {[x]} of obj);', Context.Empty],
    // ['[x, y, ...z = arr] = x', Context.Empty],
    ['y, ...x => x', Context.Empty],
    ['...x => x', Context.Empty],
    ['(x, ...y, z) => x', Context.Empty],
    ['(...x, y) => x', Context.Empty],
    ['(...x = y) => x', Context.Empty],
    ['([...x.y]) => z', Context.Empty],
    // ['[...{a = b} = c] = d;', Context.Empty],
    // ['([...{a = b} = c]) => d;', Context.Empty],
    ['z={x:b\n++c};', Context.Empty],
    //['`x${b\n++c}y`;', Context.Empty],
    ['class let {}', Context.Empty],
    ['([foo]) = arr;', Context.Empty],
    ['([x, y]) = z;', Context.Empty],
    ['{x, y} = z;', Context.Empty],
    ['({x, y}) = z;', Context.Empty],
    ['(a \n/b/);', Context.Empty],
    ['(++x) => x;', Context.Empty],
    ['(++x, y) => x;', Context.Empty],
    ['(x--) => x;', Context.Empty],
    ['(x--, y) => x;', Context.Empty],
    ['f = function([...[ x ] = []]) {};', Context.Empty],
    //['f = ([...[ x ] = []]) => {};', Context.Empty],
    // ['for (var a = (++effects, -1) in x);', Context.Empty],
    ['try {} catch({e}=x){}', Context.Empty],
    ['try {} catch(e=x){}', Context.Empty],
    ['try {} catch({e}=x){}', Context.Empty],
    ['new x() = y', Context.Empty],
    ['++new x()', Context.Empty],
    ['new x()++', Context.Empty],
    ['new delete x.y', Context.Empty],
    ['new delete x().y', Context.Empty],
    ['new typeof x', Context.Empty],
    ['new typeof x.y', Context.Empty],
    ['new typeof x().y', Context.Empty],
    ['new ++x', Context.Empty],
    ['new ++x.y', Context.Empty],
    ['new ++x().y', Context.Empty],
    ['new x++', Context.Empty],
    ['new x.y++', Context.Empty],
    ['(x)\n++;', Context.Empty],
    ['(((x)))\n++;', Context.Empty],
    ['x.foo++.bar', Context.Empty],
    ['(x)\n--;', Context.Empty],
    ['(((x)))\n--;', Context.Empty],
    ['x.foo--.bar', Context.Empty],
    ['a\n++', Context.Empty],
    ['({get ', Context.Empty],
    ['{ return; }', Context.Empty],
    ['function x(...a = 1){}', Context.Empty],
    ['[...x,,] = 0', Context.Empty],
    ['({a,,} = 0)', Context.Empty],
    ['({get a(){}})=0', Context.Empty],
    ['a enum;', Context.Empty],
    ['() + 0', Context.Empty],
    ['i + 2 = 42', Context.Empty],
    // ['for (var [a] = 0 in {});', Context.OptionsDisableWebCompat],
    // ['for (var [a] = 0 in {});', Context.Empty],
    ['function f([...foo, bar] = obj){} ', Context.Empty],
    ['function f([...foo,,] = obj){}', Context.Empty],
    ['function f([...[a, b],,] = obj){}', Context.Empty],
    ['(function f([...bar = foo] = obj){} ', Context.Empty],
    ['function f([... ...foo] = obj){}', Context.Empty],
    [' function f([...] = obj){}', Context.Empty],
    // ['function f([...,] = obj){} ', Context.Empty],
    ['function f([.x] = obj){}', Context.Empty],
    ['function f([..x] = obj){}', Context.Empty],
    ['function f([...[a, b],] = obj){}', Context.Empty],
    ['function f([...foo, bar]){}', Context.Empty],
    ['function f([...foo, bar] = obj){}', Context.Empty],
    ['function f([...foo,]){}', Context.Empty],
    ['function f([...foo,] = obj){}', Context.Empty],
    ['function f([...foo,,]){}', Context.Empty],
    ['function f([...foo,,] = obj){}', Context.Empty],
    ['function f([...[a, b],,] = obj){}', Context.Empty],
    ['function f([...[a, b],] = obj){}', Context.Empty],
    ['function f([...[a, b],]){}', Context.Empty],
    ['function f([...bar = foo]){}', Context.Empty],
    ['function f([...bar = foo] = obj){}', Context.Empty],
    ['function f([... ...foo]){}', Context.Empty],
    ['function f([... ...foo] = obj){}', Context.Empty],
    ['function f([...]){}', Context.Empty],
    ['function f([...] = obj){}', Context.Empty],
    // ['function f([...,]){}', Context.Empty],
    // ['function f([...,] = obj){}', Context.Empty],
    ['function f([..x]){}', Context.Empty],
    ['yield x + y', Context.Empty],
    ['5 + yield x', Context.Empty],
    ['yield x', Context.Empty],
    ['5 + yield x + y', Context.Empty],
    ['function* f(){ 5 + yield x + y; }', Context.Empty],
    ['({x: this}) => null', Context.Empty],
    ['function f(){ 5 + yield x + y; }', Context.Strict],
    ['function f(){ call(yield x); }', Context.Strict],
    [`function* g() { yield 3 + yield 4; }`, Context.Empty],
    // ['function *g(){ (a, b, c, yield) => 42 }', Context.Empty],
    // ['function*g({yield}){}', Context.Empty],
    ['({[a,b]:0})', Context.Empty],
    ['[[[[[[[[[[[[[[[[[[[[{a=b}]]]]]]]]]]]]]]]]]]]]', Context.Empty],
    ['with(true) let a', Context.Empty],
    ['() => {}()', Context.Empty],
    [`function* g() { yield 3 + yield; }`, Context.Empty],
    ['+i = 42', Context.Empty],
    ['for (let x, y, z, let;;;) {}', Context.Empty],
    ['([ 5 ]) => {}', Context.Empty],
    ['(function ({e: a.b}) {})', Context.Empty],
    ['[,', Context.Empty],
    ['try { }', Context.Empty],
    // ['({a,...b}) => 0;', Context.Empty],
    // ['for (const x = 1 of y);', Context.Empty],
    ['(...a) + 1', Context.Empty],
    ['function* y({yield}) {}', Context.Empty],
    ['throw', Context.Empty],
    ['([a.b]) => 0', Context.Empty],
    ['(b, ...a)', Context.Empty],
    // ['for(let a = 0 of b);', Context.Empty],
    ['var if = 0', Context.Empty],
    ['1 + { t:t ', Context.Empty],
    //     ['for (var [p]=q of r);', Context.Empty],
    // ['class A {', Context.Empty],
    // ['try {} catch (0) {} ', Context.Empty],
    ['f(....a)', Context.Empty],
    ['(0, {a = 0}) = 0', Context.Empty],
    ['if(false)', Context.Empty],

    ['var {(a)} = 0', Context.Empty],
    ['({(a)} = 0)', Context.Empty],
    ['({a:(b = 0)} = 1)', Context.Empty],
    ['[(a = 0)] = 1', Context.Empty],
    ['var [(a)] = 0', Context.Empty],

    //['for(let x=1 in [1,2,3]) 0', Context.Empty],
    //['for(var x=1 of [1,2,3]) 0',  Context.Empty],
    //['for(let x=1 of [1,2,3]) 0', Context.Empty],
    ['({a: b += 0} = {})', Context.Empty],
    ['for(let x=1 in [1,2,3]) 0', Context.Empty],
    ['[a += b] = []', Context.Empty],
    ['({[foo]: a + b} = baz)', Context.Empty],
    ['[...{a = b} = c] = x', Context.Empty],
    ['([...{a = b} = c]) => d', Context.Empty],
    ['for(let x=1 in [1,2,3]) 0', Context.Empty],
    ['do label1: label2: function f() {} while (false)', Context.Empty],
    ['for (const x in {}) label1: label2: function f() {}', Context.Empty],
    ['for (let x in {}) label1: label2: function f() {}', Context.Empty],
    ['for (x in {}) label1: label2: function f() {}', Context.Empty],
    ['for (var x in {}) label1: label2: function f() {}', Context.Empty],
    ['for (const x of []) label1: label2: function f() {}', Context.Empty],
    ['for (let x; false; ) label1: label2: function f() {}', Context.Empty],
    ['for (const let in {}) {}', Context.Empty],
    ['for (let [x, x] in {}) {}', Context.Empty],
    ['for (let x in {}) { var x; }', Context.Empty],
    ['for (let let in {}) {}', Context.Empty],
    ['for ({ m() {} } in {}) {}', Context.Empty],
    ['for ([(x, y)] in {}) {}', Context.Empty],
    ['for (const [x, x] of []) {}', Context.Empty],
    ['for (const x of []) { var x; }', Context.Empty],

    ['for (const let of []) {}', Context.Empty],
    ['for (let [x, x] of []) {}', Context.Empty],
    ['for (let x of []) { var x; }', Context.Empty],
    ['for (let let of []) {}', Context.Empty],
    ['for ([(x, y)] of []) {}', Context.Empty],
    ['for ({ m() {} } of []) {}', Context.Empty],
    ['for (const x; false; ) { var x; }', Context.Empty],
    ['for (let x; false; ) { var x; }', Context.Empty],
    ['function*g([yield]){}', Context.Empty],
    ['([[[[[[[[[[[[[[[[[[[[{a:b[0]}]]]]]]]]]]]]]]]]]]]])=>0;', Context.Empty],
    ['"use strict"; const const = 1;', Context.Empty],
    ['(10, 20) => 0', Context.Empty],
    // ['let [x]', Context.Empty],
    // ['(...[ 5 ]) => {}', Context.Empty],
    ['function test_func() { "use strict"; ++arguments; }', Context.Empty],
    // ['class x {async *prototype(){}}', Context.Empty],
    ['class x { async [x]s){}}', Context.Empty],
    ['s = {s: true = x} = x', Context.Empty],
    ['s = {s: true = x}', Context.Empty],
    ['{ if (x) function f() {} ; function f() {} }', Context.OptionsDisableWebCompat],
    ['{ var f = 123; if (true) function f(){} }', Context.OptionsDisableWebCompat],
    // [ `for ({x=y} in a) b;`, Context.OptionsDisableWebCompat],
    // [ `for ({x=y} ;;) b;`, Context.Empty],
    ['function test_func() { "use strict"; ++arguments; }', Context.Empty],
    ['export {x: a}', Context.Module],
    ['({x=y})', Context.Module],
    // ['for ({x=y};;);', Context.Empty],
    //    ['async function f() {} var f;', Context.Module],
    ['"use strict"; var foo, yield;', Context.Empty],
    ['"use strict"; try { } catch (yield) { }', Context.Empty],
    ['"use strict"; function yield() { }', Context.Empty],
    ['"use strict"; (function yield() { })', Context.Empty],
    ['"use strict"; function foo(yield) { }', Context.Empty],
    ['"use strict"; function foo(bar, yield) { }', Context.Empty],
    ['"use strict"; function * yield() { }', Context.Empty],
    ['"use strict"; (function * yield() { })', Context.Empty],
    ['"use strict"; yield = 1;', Context.Empty],
    ['"use strict"; var foo = yield = 1;', Context.Empty],
    ['"use strict"; ++yield;', Context.Empty],
    ['"use strict"; yield++;', Context.Empty],
    ['"use strict"; yield: 34;', Context.Empty],
    ['"use strict"; function * gen() { function not_gen() { (function yield() { })}', Context.Empty],
    ['"use strict"; function * gen() { function not_gen() {function foo(yield) { }}', Context.Empty],
    ['"use strict"; function foo(bar, yield) { }', Context.Empty],
    ['() => "use strict"; function * yield() { }}', Context.Empty],
    ['() => "use strict"; ++yield;}', Context.Empty],
    ['"use strict"; ++arguments;', Context.Empty],
    ['"use strict"; ++arguments;', Context.Empty],
    ['"use strict"; ++arguments;', Context.Empty],
    ['"use strict"; ++arguments;', Context.Empty],
    ['function test_func() { "use strict"; ++arguments; }', Context.Empty],
    ['"use strict"; ++arguments;', Context.Empty],
    ['"use strict"; arguments++', Context.Empty],
    ['"use strict"; eval++;', Context.Empty],
    ['++arguments;', Context.Strict | Context.Module],
    ['arguments++', Context.Strict | Context.Module],
    ['eval++;', Context.Strict | Context.Module],
    ['var x = /[a-z]/\\ux', Context.Empty],
    ['with(true) class a {}', Context.Empty],
    ['function*g(yield = 0){}', Context.Empty],
    ['switch (cond) { case 10: let a = 20; ', Context.Empty],
    ['var if = 42', Context.Empty],
    ['"use strict"; a package', Context.Empty],
    ['(function*() { yield* })', Context.Empty],
    ['import { foo, bar }', Context.Module],
    ['if (1) import "acorn";', Context.Module],
    ['with(x) function f() {}', Context.OptionsDisableWebCompat | Context.Strict],
    ['if (x) async function f() {}', Context.OptionsDisableWebCompat],
    ['if (x); else async function f() {}', Context.OptionsDisableWebCompat],
    ['foo: async function f() {}', Context.OptionsDisableWebCompat],
    ['for (;;) async function f() {}', Context.Empty],
    ['while (;;) async function f() {}', Context.Empty],
    ['do async function f() {}; while (x);', Context.Empty],
    ['with(x) async function f() {}', Context.Strict],
    ['(b\n++c);', Context.Empty],
    ['for (;b\n++c);', Context.Empty],
    ['for (b\n++c;;);', Context.Empty],
    ['if (b\n++c);', Context.Empty],
    ['"\\x";', Context.Empty],
    ['3ea', Context.Empty],
    ['3in []', Context.Empty],
    ['3e+', Context.Empty],
    ['3x0', Context.Empty],
    ['/test', Context.Empty],
    ['{', Context.Empty],
    ["'use strict';(function(a, ...args, b){ return args;}", Context.Empty],
    ["'use strict';(function(...args,   b){ return args;}", Context.Empty],
    ["'use strict';(function(a, ...args,   b){ return args;}", Context.Empty],
    ["'use strict';(function(...args,\tb){ return args;}", Context.Empty],
    ["'use strict';(function(a,...args\t,b){ return args;}", Context.Empty],
    ["'use strict';(function(...args\r\n, b){ return args;}", Context.Empty],
    ["'use strict';(function(a, ... args,\r\nb){ return args;}", Context.Empty],
    ["function fn() { 'use strict';var ...x = [1,2,3];} fn();", Context.Empty],
    ["function fn() { 'use strict';var [...x,] = [1,2,3];} fn();", Context.Empty],
    ["function fn() { 'use strict';var [...x, y] = [1,2,3];} fn();", Context.Empty],
    ["function fn() { 'use strict';var { x } = {x: ...[1,2,3]}} fn();", Context.Empty],
    // ['() => return', Context.Empty],
    ['return', Context.Empty],
    [' function  a(b,,) {}', Context.Empty],
    [' function* a(b,,) {}', Context.Empty],
    ['(function  a(b,,) {});', Context.Empty],
    ['(function* a(b,,) {});', Context.Empty],
    ['(function   (b,,) {});', Context.Empty],
    ['(function*  (b,,) {});', Context.Empty],
    [' function  a(b,c,d,,) {}', Context.Empty],
    [' function* a(b,c,d,,) {}', Context.Empty],
    ['(function  a(b,c,d,,) {});', Context.Empty],
    ['(function* a(b,c,d,,) {});', Context.Empty],
    ['(function   (b,c,d,,) {});', Context.Empty],
    ['(function*  (b,c,d,,) {});', Context.Empty],
    ['(b,,) => {};', Context.Empty],
    ['(b,c,d,,) => {};', Context.Empty],
    ['a(1,,);', Context.Empty],
    ['a(1,2,3,,);', Context.Empty],
    [' function  a1(,) {}', Context.Empty],
    [' function* a2(,) {}', Context.Empty],
    ['(function  a3(,) {});', Context.Empty],
    ['(function* a4(,) {});', Context.Empty],
    ['(function    (,) {});', Context.Empty],
    ['(,) => {};', Context.Empty],
    ['a1(,);', Context.Empty],
    // no trailing commas after rest parameter declaration
    [' function  a(...b,) {}', Context.Empty],
    [' function* a(...b,) {}', Context.Empty],
    ['(function  a(...b,) {});', Context.Empty],
    ['(function* a(...b,) {});', Context.Empty],
    ['(function   (...b,) {});', Context.Empty],
    ['(function*  (...b,) {});', Context.Empty],
    [' function  a(b, c, ...d,) {}', Context.Empty],
    [' function* a(b, c, ...d,) {}', Context.Empty],
    ['(function  a(b, c, ...d,) {});', Context.Empty],
    ['(function* a(b, c, ...d,) {});', Context.Empty],
    ['(function   (b, c, ...d,) {});', Context.Empty],
    ['(function*  (b, c, ...d,) {});', Context.Empty],
    ['(...b,) => {};', Context.Empty],
    ['(b, c, ...d,) => {};', Context.Empty],
    // parenthesized trailing comma without arrow is still an error
    ['(,);', Context.Empty],
    ['(a,);', Context.Empty],
    ['(a,b,c,);', Context.Empty],
    ['*() => {return}', Context.Empty],
    ['if (x) function f() {}', Context.OptionsDisableWebCompat],
    ['if (x); else function f() {}', Context.OptionsDisableWebCompat],
    ['foo: function f() {}', Context.OptionsDisableWebCompat],
    ['if (x); else function * f() {}', Context.Empty],
    ['foo: function *f() {}', Context.Empty],
    ['for (;;) function * f() {}', Context.Empty],
    ['while (;;) function * f() {}', Context.Empty],
    ['do function * f() {}; while (x);', Context.Empty],
    ['with(x) function * f() {}', Context.Strict],
    ['if (x) let y = x', Context.Empty],
    ['if (x); else let y = x', Context.Empty],
    ['foo: let y = x', Context.Empty],
    ['for (;;) let y = x', Context.Empty],
    ['while (;;) let y = x', Context.Empty],
    ['do let y = x; while (x);', Context.Empty],
    ['with(x) let y = x', Context.Strict],
    ['if (x) const y = x', Context.Empty],
    ['if (x); else const y = x', Context.Empty],
    ['foo: const y = x', Context.Empty],
    ['for (;;) const y = x', Context.Empty],
    ['do const y = x; while (x);', Context.Empty],
    ['with(x) const y = x', Context.Strict],
    ['foo: class x {}', Context.Empty],
    ['for (;;) class X {}', Context.Empty],
    ['with(x) class X {}', Context.Empty],
    ['{ return; }', Context.Empty],
    ['({get ', Context.Empty],
    ['new.prop', Context.Empty],
    ['for (const of 42);', Context.Empty],
    ['1 + { t:t,', Context.Empty],
    ['function hello() { "use strict"; 021; }', Context.Empty],
    ['for(let ? b : c in 0);', Context.Empty],
    ['for (const x = 0 in y){}', Context.Empty],
    ['0B12', Context.Empty],
    ['({a({e: a.b}){}})', Context.Empty],
    ['"use strict"; "\\00";', Context.Empty],
    ['/*', Context.Empty],
    ['try {} catch (answer()) {} ', Context.Empty],
    ['(function *(x, ...yield){})', Context.Empty],
    ['function hello() { "use strict"; "\\1"; }', Context.Empty],
    ['function*g({yield}){}', Context.Empty],
    ['({set a({e: a.b}){}})', Context.Empty],
    ['(function() { yield 3; })', Context.Empty],
    ['[', Context.Empty],
    ['(a', Context.Empty],
    ['{ return; }', Context.Empty],
    [' function null() { }', Context.Empty],
    ['[+{a = 0}];', Context.Empty],
    ['for (const of 42);', Context.Empty],
    //    ['var x,;', Context.Empty],
    ['class ', Context.Empty],
    [' function* a({e: a.b}) {}', Context.Empty],
    ['1.e', Context.Empty],
    ['export 3', Context.Module | Context.Strict],
    ['export var await', Context.Module | Context.Strict],
    ['try {} catch (answer()) {} ', Context.Empty]
  ];

  fail('Miscellaneous - Failurea', inValids);
});
