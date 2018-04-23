import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/utilities';
import * as t from 'assert';
import { parse } from '../../../src/parser/parser';

describe('Miscellaneous - Pass', () => {

    const programs = [
        '"\\u{714E}\\u{8336}"',
        '"\\u{20BB7}\\u{91CE}\\u{5BB6}"',
        '0o0',
        'function test() {\'use strict\'; 0o0; }',
        '0o2',
        '0o12',
        '0O0',
        'function test() {\'use strict\'; 0O0; }',
        '0O2',
        '0b10',
        '0B1',
        '0B10',
        '`42`',
        'raw`42`',
        'raw`hello ${name}`',
        '`$`',
        '`\\n\\r\\b\\v\\t\\f\\\n\\\r\n`',
        '`\n\r\n\r`',
        '`\\u{000042}\\u0042\\x42u0\\A`',
        'new raw`42`',
        '(1+2)*3',
        '1+1',
        'var a = 1, b = 2, c, d = 1 + 1;',
        `(1+2)*3 || 4 && 5 && 6 || 7
        ? void 0 
        : void 1;`,
        `1 === 1 ? 1 : 2 !== 2 ? 2 : 3 == 3 ? 3 : 4 != 4 ? 4 : 5;`,
        `1 + 2 - 3 * 4 / 5 % 6 << 7 >> 8 >>> 9 ? 1 ^ 1 : ~1 - 1, 2, 3;`,
        `var a, b, c;`,
        `if (1) {
            1;
          } else {
            2;
          }`,
         `function a() {
        }`,
        `function a(a) {}`,
        `function a(a, b, c) {}`,
        `function a(a, b, c) {
            return a + b + c;
          }`,
          `var a = function(a, b, c) {
            return a + b + c;
          };`,
          `var a = function a(a, b, c) {
            return a + b + c;
          };`,
          `if (1) 1;`,
          `if (1) 1; else 2;`,
          `'(' + (a === b ? c : d) + ')' + e;`, 
        '`outer${{x: {y: 10}}}bar${`nested${function(){return 1;}}endnest`}end`',
        'switch (answer) { case 42: let t = 42; break; }',
        '() => "test"',
        'e => "test"',
        'eval => 42',
        `/42/`,
        `/42/g`,
        `(function() {
            1;
          })();`,
          `(function() {
            1;
          }());`,
          `(function() {
            1;
          }).call(this);`,
        `[01, 011, 0111, 01111]`,
        `var array = [
            0, 42, 12345, -1, -1.1, -0.1, 864e5, .5, 1., 1.e2, 1.e+1,
            -1.4142135623730951, 3.141592653589793,
            0.0314e-1, 0.0314E+2, .0314e-1, .0314E+2,
            0x0FFF, 0X7ffffffF, 0b101010, 0B101010, 0o777, 0O777
          ];`,
          `0777`,
        '(a) => 00',
        `var o = {
            a: function() {
              return 1;
            }
          };`,
         `var o = {
            get a() {
              return 1;
            }
          };`,
        `true`,
        `{}`,
        `{a:1}`,
        `({ a: 1 })`,
        `({ a: 1, b: 2 })`,
        `({ a: 1, b: 2, c: 1 + 1 })`,
        `var o = {
            get get() {
              return 1;
            }
          };`,
         `var o = {
            a: function() {},
            b: function() {},
            c() {},
            d() {},
            get e() {},
            set e(e) {}
          };`,
         `[,]`,
         `[1]`,
         `var a = 1;
         a * a;
         a / a;
         a % a;
         a + a;
         a - a;
         a << a;
         a >> a;
         a >>> a;
         a < a;
         a > a;
         a <= a;
         a >= a;
         a instanceof a;
         a in a;
         a == a;
         a != a;
         a === a;
         a !== a;
         a & a;
         a ^ a;
         a | a;
         a && a;
         a || a;`,
         `[[]]`,
         `[[1]]`,
         `var a = 1;
         a -= 1;
         a += 1;
         a *= 1;
         a %= 1;
         a /= 1;
         a &= 1;
         a |= 1;
         a >>= 1;
         a >>>= 1;
         a <<= 1;
         `,
         `var a;
         a = 1, a -= 1, a += 1, a *= 1, a %= 1, a /= 1, a &= 1, a |= 1, a >>= 1, a >>>= 1, a <<= 1;`,
         `1 ? 2 : 3`,
         `1 ? 2 : 3 ? 4 : 5 ? 6 : 7 ? 8 : 9 ? 10 : 11 ? 12 : 13 ? 14 : 15 ? 16 : 17;`,
         `a.b.c.d[e][f + g]();`,
         `var a = 1;
         a || a, a && a, a | a, a ^ a, a & a, a !== a, a === a, a != a, a == a, a in a, a instanceof a, a >= a, a <= a, a > a, a < a, a >>> a, a >> a, a << a, a - a, a + a, a % a, a / a, a * a;`,
         `var a = 1;
         a || a && a ? (a | a) +a  : ((a ^ a) & a) ? a + a - a + a + a : a === a ? ((a >>> a) | a) + a : a !== a ? a % a : a != a ? a - a - a : a == a ? a * a * a : a in a ? a >> a >> a : a instanceof a ? a << a << a : a >= a ? a / a / a : a <= a ? a % a % a : a > a ? a * a / a : a < a ? (a >>> a) >> a << a - a + a % a / a * a : a;`,
         `var a = 1;
         a = -a;
         a = +a;
         a = !a;
         a = ~a;
         a = ++a;
         a = --a;
         a = a++;
         a = a--;
         a = typeof a;
         a = void a;
         a = delete a;`,
         `var a = 1;
         a = -a -a---a;
         a = +a +a+++a;
         a = !!!a;
         a = ~~~a;
         a = typeof typeof a;
         a = void void a;
         a = delete delete a;`,
         `new A`,
         `new new A();`,
         `new (a + b)();`,
         `a.b`,
         `a.b.c.d[e][f + g]`,
         '`1 + 1 = ${ 1 + 1 }`;',
         'a`1 + 1 = ${ 1 + 1 }`;',
         '(function() {})`1 + 1 = ${ 1 + 1 }`;',
         '(function() {  var a = (function() {  })`1 + 1 = ${ 1 + 1 }`;})();',
         `const a = 1 + 1;`,
         `{
            let a = 1;
            {
              let a = 2;
            }
          }`,
          `for (var i = 0; i < 10; i++) {
            if (i === 1) {
              continue;
            }
            if (i === 5) {
              break;
            }
          }`,
          `for (var i = 0; i < 10; i++) {}`,
          `for (i = 0; i < 10; i++) {}`,
          `for (var i = 0, len = a.length; i < len; i++) {}`,
          `for (var i = 0, len = a.length; i < len; i++);`,
          `for (i = 0, len = a.length; i < len; i++);`,
          `for (var a in b);`,
          `for (a in b) {}`,
          `for (var a of b) {}`,
          `for (a of b) {}`,
          `for (var a in b) {
            for (var c in d) {}
          }`,
          `switch (a) {
        }`,
        `switch (a) {
            case 1:
          }`,
          `a:
          for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
              if (j === 1) {
                continue a;
              }
              if (j === 5) {
                break a;
              }
            }
          }`,
          `function a() {
            return
            1 + 1;
          }`,
          `with ({ a: 1, b: 2 }) {}`,
          `throw new Error();`,
          `try {
            throw new Error();
          } catch (e) {}`,
          `try {
            throw new Error();
          } catch (e) {
            throw e;
          } finally {}`,
          `switch (a) {
            default:
              b++;
              break;
          }`,
          `do a(); while (0);`,
          `do {
            a();
          } while (0);`,
          `while (0) {}`,
          `switch (a) {
            case 1: break;
          }`,
          `switch (a) {
            case 1:
            case 2:
              break;
          }`,
          `switch (a) {
            case 1:
            case 2:
              break;
            default:
          }`,
         `switch (a) {
            case 1:
              b++;
            case 2:
              c++;
              break;
            default:
              d++;
          }`,
          '`a` + `b`',
          'function a({ a }) {}',
          '(a, b, c) => 1;',
          `(a, b, c) => {
            return 1;
          };`,
          `var a = (a, b, c) => {
            return 1;
          };`,
        '(eval, a = 10) => 42',
        '(x => x)',
        'x => y => 42',
        '(x) => ((y, z) => (x, y, z))',
        'foo(() => {})',
        'foo((x, y) => {})',
        'x = { method() { } }',
        '[a, b] = [b, a]',
        '[a.r] = b',
        'let [a,,b] = c',
        '({ responseText: text } = res)',
        'const {a} = {}',
        'const [a] = []',
        'let {a} = {}',
        'let [a] = []',
        'var {a} = {}',
        `function a(a = 1, b) {}`,
        `function a({ a: A }) {}`,
        `function a({ a, b }) {}`,
        `function a({ a: A = 1 }) {}`,
        `function a({ a: A = 1 + 1 }) {}`,
        `function a({ a: A = 1 + 1, b: { c } }) {}`,
        `function a({ a: A = 1 + 1, b: { c: { d: D = 1 + 1, e: { f } } } }) {}`,
        `function a({ a: A = 1 + 1, b: { c: { d: D = 1 + 1, e: { f = 1 + 1 } } } }) {}`,
        `function a(a = 1) {}`,
        `function a(a = 1 + 1) {}`,
        `function a([,]) {}`,
        `function a(a = 1, b = 2 + 3) {}`,
        `function a(a = 1, b = 2 + 3, c) {}`,
        `function a(a = 1, b = 2 + 3, c, ...d) {}`,
        `function a(...a) {}`,
        `function a(a = { b: function(c = 1, d = 2) {} }) {}`,
        `function a(a = function(b = 1, c = function(d = function(e) {}) {} ) {}) {}`,
        `function a([ a, b ]) {}`,
        `function a([ a, b, ...c ]) {}`,
        `function a([ a = 1 ]) {}`,
        `function a([ a = 1, b = 2 + 3, ...c ]) {}`,
        `function a([...a]) {}`,
        `var [...a] = o;`,
        `function a([ a = [ b = [c]], d,, ...e]) {}`,
        `var {a} = o;`,
        `var {a, b} = o;`,
        `var {a: A, b: B} = o;`,
        `var {a: A, b: B = 1} = o;`,
        `var {a: A, b: B = 1, c: { d }} = o;`,
        `var {a: A, b: B = 1, c: { d: D = 2 + 3, e: { f = 4 + 5 } }} = o;`,
        `var [a] = o;`,
        `var [a, b] = o;`,
        `var [a, b, ...c] = o;`,
        `var o = {
            *a() {}
          };`,
        `var o = {
            a: function *() {}
          };`,
        `var [,] = o;`,
        `var [,,] = o;`,
        `[...a, ...b]`,
        `[...a, ...b, c, ...d]`,
        `var o = {
            ['a' + 'b']: 1,
            [1 + 2]: 3
          };`,
          `var o = {
            0: 0,
            'a': 'a',
            0xFF: 0xFF
          };`,
          `function* a() {
            yield* 1;
          }`,
        `''+""`,
        `function* a() {
            yield function*() {
              yield 1;
            };
          }`,
         `function* a() {
            yield yield;
          }`,
         `function* a() {yield}`,
         `var A = {
            get [a+b]() {}
          }`,
         `var A = {
            set [a+b](a) {}
          }`,
         `class A {
            *b() {}
          }`,
          `const f = x => x*x`,
          `let {a} = {};`,
          `let o = {a};`,
          `let o = {a, b};`,
        `({ a: { b: { c = "it worked" } } } = { a: { b: {} } });`,
        `a: while (true) while (true) continue a;`,
        `a = { "b": 1 }`,
        `a(b, c)`,
        `(function() {
            1, 2, 3;
        }());`,
        `'use strict';
        a.static();`,
        `with({}) {
        };`,
        `[...a[1]] = 2;`,
        `//
        1`,
        `(function() {
            if (a) {
                b();
            } else {
                return 1;
                c();
            }
            return 2;
        }());
        `,
        `try {} catch (a) { if(1) function a(){} }`,
        `function a() { new.\u0074arget; }`,
        `for(a; a < 1; a++) b(a);`,
        `(function() {
            a(), 1, 2;
        }());
        `,
        `if (a) {
            b();
        } else if (c) {
            d();
        } else if (e) {
            f();
        }
        
        if (a) {
            b();
        } else if (c) {
            d();
        } else if (e) {
            f();
        } else {
            g();
        }`,
        `('\u{0000000000F8}')`,
        `(class a extends a {})`,
        `"Hello\\412World"`,
        `/[x-z]/i`,
        `  -->`,
        `var _፩፪፫፬፭፮፯፰፱`,
        `var A\u{42}C;`,
        `(function() {
            for (;;) {
                break;
                a();  // This should be removed.
            }
            b();
        }());
        `,
        `function a(b) {
            for (var c = 1, d = b.e(); ; c++) {}
        }`,
        `'use strict'; 0o0`,
        `a = { get null() {} }`,
        `({1: {} / 1})`,
        `(let[a]=b)`,
        `for (;;) {
            with (a) {
                continue;
            }
        }`,
        `({a,b=b,a:c,[a]:[d]})=>1;`,
        `var a;
        if (b()) {
            a();
        } else {
            a();
        }`,
        `(function(){ a() })();`,
        `"use strict";a={b:1,b:2}`,
        `let [a,,]=1`,
        `b: while (1) { continue /*
            */ a; }`,
            `if (a && b) {
                c(a)[1].b.d = e();
            } else
                c(a)[2].b.d = f();`,
        `(a, ...[b]) => {}`,
        `(function(...a){})`,
        `var [a, ...[b, c]] = d`,
        `({a(b,c){}})`,
        `[a, a] = 1`,
        `try {} catch ({a}) {}`,
        'const {a:b} = {}',
        'class A {\'constructor\'() {}}',
        '({f: function({x} = {x: 10}) {}})',
        '({f({x} = {x: 10}) {}})',
        '(class {f({x} = {x: 10}) {}})',
        '(({x} = {x: 10}) => {})',
        'x = function(y = 1) {}',
        'function f(a = 1) {}',
        'x = { f: function(a=1) {} }',
        'function f(a, ...b) {}',
        'function x([ a, b ]){}',
        'function x({ a, b }){}',
        '(function x({ a, b }){})',
        '({ x([ a, b ]){} })',
        '({ x({ a: { w, x }, b: [y, z] }, ...[a, b, c]){} })',
        '(...a) => {}',
        '(a, ...b) => {}',
        '({ a }) => {}',
        '({ a }, ...b) => {}',
        '({ a: [a, b] }, ...c) => {}',
        '({ a: b, c }, [d, e], ...f) => {}',
        '[...a] = b',
        '[a, ...b] = c',
        '[{ a, b }, ...c] = d',
        '[a, ...[b, c]] = d',
        `var [] = 1;`,
        `/*a
        b*/ 1`,
        //`01.a`,
        `(function() {
            if (a) return b;
            else return c;
            }());
            `,
            `a = {
                b(c, d) {
                    return a;
                }
            }
            e = {
                b([{c}]) {
                    return c;
                },
                f(){}
            }`,
            `(function() {
                return 1;
                {
                    var a = 2;
                }
            }());
            `,
            `/**
            * @type {number}
            */
           var a = 1,
               /**
                * @type {number}
                */
               b = 2;
           `,
        `(function () {
            var a = {};
            a.b + (c(), d(), e());
        }());`,
        'var [...a] = b',
        'var [a, ...b] = c',
        'var [{ a, b }, ...c] = d',
        'var [a, ...[b, c]] = d',
        'func(...a)',
        'func(a, ...b)',
        '/[a-z]/u',
        'do {} while (false) foo();',
        'yield* 10',
        'e => yield* 10',
        'let + 1',
        'var yield = 2',
        'doSmth(`${x} + ${y} = ${x + y}`)',
        'function normal(x, y = 10) {}',
        `for (let in a) {}`,
        '`{${x}}`, `}`',
        '`${/\\d/.exec(\'1\')[0]}`',
        'var _𐒦 = 10;',
        'var 𫠝_ = 10;',
        'let [x,] = [1]',
        'for (var [name, value] in obj) {}',
        'function foo() { new.target; }',
        'function foo() { new.target; }',
        `throw /* ‪ */ a`,
        `({ "__proto__": null, set __proto__(a){} })`,
        'this\n',
        'null\n',
        `var a, b;
        if (c()) {
            a = new b(1);
        } else {
            a = new b(2);
        }`,
        `function a() {
            var b = function c() { }
        }
        `,
        `var a = [ "b", "c", "d" ].e("");
        var f = [ "b", "c", "d" ].e();
        var g = [ "b", 1, 2, 3, "c" ].e("");
        var h = [ i(), "b", 4, 5, 6, "c", c() ].e("");
        var j = [ i(), c(), "b", 7, 8, 9, "c", c() ].e("");
        var k = [ 10, 11, "b", "c", d() ].e("");
        var l = [ "b", 12 + 13 + "c", "d" ].e("m");
        var n = [].e(b + c);
        var o = [].e("");
        var p = [].e("b");`,
        `(function() {
            1/-2;
        }());`,
        `;;;;`,
        '\n    42\n\n',
        '/[a-z]/g',
        '(1 + 2 ) * 3',
        '(1 + 2 ) * 3',
        '(x = 23)',
        'x = []',
        'x = [ ]',
        'x = [ 42, ]',
        'x = [ ,, 42 ]',
        'x = [ 1, 2, 3, ]',
        'x = [ 1, 2,, 3, ]',
        '日本語 = []',
      //  "T‿ = []",
        //"T‌ = []",
        'ⅣⅡ = []',
        'ⅣⅡ = []',
        'x = {}',
        'x = { answer: 42 }',
        'x = { if: 42 }',
        'x = { true: 42 }',
        'x = { false: 42 }',
        'x = { null: 42 }',
        'x = { "answer": 42 }',
        'x = { x: 1, x: 2 }',
        'x = { get width() { return m_width } }',
        'x = { get undef() {} }',
        'x = { get if() {} }',
        '/**/42',
        '// Hello, world!\n\n//   Another hello\n42',
        'if (x) { // Some comment\ndoThat(); }',
        'switch (answer) { case 42: /* perfect */ bingo() }',
        `while (1) /foo/`,
        `a = { set if(b) { c = b } }`,
        `while (1) {} /foo/`,
        `({ set a(b = new.target){} })`,
        '0',
        '5',
        '.14',
        '1.492417830e-10',
        'universe[42].galaxies',
        'universe(42).galaxies(14, 3, 77).milkyway',
        'earth.asia.Indonesia.prepareForElection(2014)',
        'universe.if',
        'x <= y',
        'x || y',
        `(function () {
            a ? !b : !c;
        }());`,
        `("\\\"")`,
        `({"a"(b, c, d) {}})`,
        `a=(function(){ return 1;})()`,
        `1 /* block comment 1 */ /* block comment 2 */`,
        `class a {static b(){} static get b(){} static set b(c){} }`,
        `(function () {
            -((a) ? b : 1)
        }());
        `,
        `function a() {
            b.c('d');
        }
        function a() {
            b.c('e');
        }
        a();
        `,
        `/\uD834/u`,
        `(function() {
            (1, eval)('');
        }());`,
        'for(;;);',
        'try { } catch (eval) { }',
        'try { } catch (arguments) { }',
        `var a;
        if (!b && !c && !d && !e) {
            a = 1;
        } else {
            a = 2;
        }`,
        'try { } catch (e) { say(e) }',
        '(function(){ return\nx; })',
        '(function(){ return // Comment\nx; })',
        'let eval = 42, arguments = 42',
        'f = ({ w = counter(), x = counter(), y = counter(), z = counter() } = { w: null, x: 0, y: false, z: \'\' }) => {}',
        '(class {async foo(a) { await a }})',
        '(async (a) => await a)',
        '(async function foo(a) { await a })',
        'async\na => a',
        'async function wrap() {\nclass A {async await() { }}\n}',
        'async function wrap() {\n({async await() { }})\n}',
        `a["b"] = "c";
        a["if"] = "if";
        a["*"] = "d";
        a["\u0EB3"] = "e";
        a[""] = "f";
        a["1_1"] = "b";`,
        '`${/\d/.a("1")[1]}`',
        `var a, b, c, d;
        a = (b, c, d);`,
        `switch (a) {
            case 'b': c();
            default:
              d();
              break;
          }`,
          `var a = /42/g.b`,
          `// Do not mangle to the same name
          e: {
              d: {
                  a("b");
                  if (c) {
                      break d;
                  }
                  break e;
              }
          }`,
          `let [a,] = [1]`,
    ];

    for (const arg of programs) {
        it(`${arg}`, () => {
            t.doesNotThrow(() => {
                parse(`${arg}`, undefined, Context.Empty);
            });
        });
    }
});