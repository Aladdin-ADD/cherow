import * as t from 'assert';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Miscellaneous - Escaped identifiers', () => {

  describe('Failure', () => {

    const invalidSyntax = [
      // https://github.com/shapesecurity/shift-parser-js/issues/376
      'if (\'foo\' \\u0069n this) {}',
      'if (this \\u0069nstanceof Array) {}',
      '(typ\\u0065of 123)',
      '(v\\u006fid 0)',
      'do { ; } wh\\u0069le (true) { }',
      '(function*() { return (n++, y\\u0069eld 1); })()',
      'var x = n\\u0075ll;',
      'var n\\u0075ll = 1;',
      'var { n\\u0075ll } = { 1 };',
      'n\\u0075ll = 1;',
      '(x === tr\\u0075e);',
      'var x = tr\\u0075e;',
      'var tr\\u0075e = 1;',
      'var { tr\\u0075e } = {};',
      'var \\u0065num = 1;',
            'var { \\u0065num } = {}',
            '(\\u0065num = 1);',
            '(x === n\\u0075ll);',
            'var x = n\\u0075ll;',
            'var x = typ\\u0065of \'blah\'',
            'v\\u0061r a = true',
            'var v\\u0061r = true',
            '(function() { return v\\u006fid 0; })()',
            'wh\\u0069le (true) { }',
            'w\\u0069th (this.scope) { }',
            '(function*() { y\\u0069eld 1; })()',
            '(function*() { var y\\u0069eld = 1; })()',
            'n\\u0065w function f() {}',
            '(function() { r\\u0065turn; })()',
            'class C extends function() {} { constructor() { sup\\u0065r() } }',
            'class C extends function() {} { constructor() { sup\\u0065r.a = 1 } }',
            'sw\\u0069tch (this.a) {}',
            'var x = th\\u0069s;',
            'th\\u0069s.a = 1;',
            'thr\\u006fw \'boo\';',
            'd\\u0065lete this.a;',
            '\\u0063o { } while(0)',
            'if (d\\u006f { true }) {}',
            'if (false) { this.a = 1; } \\u0065lse { this.b = 1; }',
            'e\\u0078port var foo;',
            'try { } catch (e) {} f\\u0069nally { }',
            'f\\u006fr (var i = 0; i < 10; ++i);',
            'f\\u0075nction fn() {}',
            'var f = f\\u0075nction() {}',
            '\\u0069f (true) { }',
            'le\\u0074 x = 5',
            'function* () { y\\u0069eld 10 })',
            'for (var i = 0; i < 100; ++i) { br\\u0065ak; }',
            'cl\\u0061ss Foo {}',
            'var x = cl\\u0061ss {}',
            '\\u0063onst foo = 1;',
            'while (i < 10) { if (i++ & 1) c\\u006fntinue; this.x++; }',
            'd\\u0065bugger;',
            'thi\\u0073 = 123;',
            'f\\u0061lse = 0;',
            'tru\\u0065 = 0;',
            'async() => { \\u0061wait: ;  };',
            '"use strict"; var \\u0079ield = 123;',
            'i\\u0066 (false) {}',
            'var i\\u0066;',
            'i\\u006E',
            'class C extends function() {} { constructor() { sup\\u0065r() } }',
            't\\u0072y { true } catch (e) {}',
            'var x = typ\\u0065of "blah"',
            'v\\u0061r a = true',
            'var { n\\u0075ll } = { 1 };',
            'n\\u0075ll = 1;',
            'try { } c\\u0061tch (e) {}',
            `'use strict'; impleme\\u{006E}ts`,
            `[v\\u{0061}r] = obj`,
            `var v\\u{0061}r = 2000000`,
            'var obj = { async method() { \\u0061wait: ; }};',
            'd\\u0065bugger;',
            'd\\u0065lete this.a;',
            '\\u0063o { } while(0)',
                // Babylon issue: https://github.com/babel/babel/issues/6717
                'while(n --> 0) { \\u0062\\u0072\\u0065\\u0061\\u{006B}; }',
                'while (i < 10) { if (i++ & 1) c\\u006fntinue; this.x++; }',
                'for (var i = 0; i < 100; ++i) { br\\u0065ak; }',
                'cl\\u0061ss Foo {}',
                '\\u0063onst foo = 1;',
                '[th\\u{69}s] = []',
                'th\\u{69}s',

    ];

    for (const arg of invalidSyntax) {

      it(`${arg}`, () => {
          t.throws(() => {
              parseSource(`${arg}`, undefined, Context.Empty);
          });
      });

      it(`${arg}`, () => {
          t.throws(() => {
              parseSource(`${arg}`, undefined, Context.Strict);
          });
      });
  }

  });

  describe('Pass', () => {

    const validSyntax = [
        '({le\\u0074: 0})',
        '({i\\u0066: 0})',
    ]


    for (const arg of validSyntax) {

      it(`${arg}`, () => {
          t.doesNotThrow(() => {
              parseSource(`${arg}`, undefined, Context.Empty);
          });
      });
  }
});
});
