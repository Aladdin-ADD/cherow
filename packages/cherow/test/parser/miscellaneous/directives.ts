import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Miscellaneous - Directives', () => {

  describe('Failure', () => {

    const InvalidSyntax = [
      // Esprima issue: #1731
      '"use strict"; 08',
      '"\\1;" "use strict";',
      '"use strict"; function f(){"\\1";}',
      '"\\1;" "use strict"; null',
      '"use strict"; with (a) b = c;',
      '"use strict"; "\\1;"',
      '"use strict"; "\\1;" null',
      '"random\\x0\nnewline"',
      '"random\\u\nnewline"',
      '"random\\u0\nnewline"',
      '"random\\ua\u2029newline"',
      '"random\\ua\rnewline"',
      '"random\\u0a\nnewline"',
      '"random\\u000\nnewline"',
      '"random\\u00a\nnewline"',
      '"random\\u{0\nnewline"',
      '"random\\u{a\nnewline"',
      '\'random\\x foo\'',
      '"random\\u{a\rnewline"',
      '\'random\\u foo\'',
      '\'random\\u0 foo\'',
      '\'random\\u00 foo\'',
      '\'random\\u0a foo\'',
      '\'random\\x0\\ foo\'',
      'function f(){\n"foo" "bar"',
      '\'random\\ua\\ foo\'',
      '\'random\\x0\\ foo\'',
      '\'random\\u0a\\ foo\'',
      '\'random\\xx foo\'',
      '\'random\\u00a\\ foo\'',
      '\'random\\uax foo\'',
      '\'random\\u0au foo\'',
      'function foo() { "use strict"; with (a) b = c; }',
      '"use strict"; function foo() { with (a) b = c; }',
      '"use strict"; function hello() { "\\000"; }',
      '"use strict"; function hello() { "\\00"; }',
      '"use strict"; function hello() { "\\0123"; }',
      'function hello() { "use strict"; "\\000"; }',
      'function hello() { "use strict"; "\\00"; }',
      'function hello() { "use strict"; "\\0123"; }',
      'function hello("\\000008") { "use strict"; }',
      `"use strict";
      "use strict";
      var public = 1;`,
      ` function fun() {
          "use strict";
                 var public = 1;
      }`,
    ];

    for (const arg of InvalidSyntax) {

        it(`${arg}`, () => {
            t.throws(() => {
                parseSource(`${arg}`, undefined, Context.Empty);
            });
        });
    }
});

    describe('Pass', () => {

      const validSyntax = [
        ` "icefapper directive";`,
        ` "icefapper directive"; "no strict"; "use strict";`,
        '"use   strict";  var public = 1;',
        '"use \\t strict";  var public = 1;',
        '"use \\b  strict";  var public = 1;',
        '"use   strict";  var public = 1;',
        '("use strict")',
        '"\\n\\r\\t\\v\\b\\f\\\\\\\'\\"\\0"',
        '"use some future directive"',
        '"use some future directive";',
        '"use some future directive"; "use strict";',
        `/* comment */ "use  strict";`,
        `"use  strict";
        var public = 1;`,
        ` "another directive"
        "use strict" ;`,
        `// comment
        /* comment */ "use strict";`,
        `"use strict";    /* comment */   // comment`,
        ` var interface = 2;
        "use strict";
        var public = 1;`,
        '"Hello\\312World"',
        '"use strict"',
        '\'use\\x20strict\'',
        '"use\\x20strict"',
        '\'use asm\'',
        '\'use asm\'; \'use strict\'',
        '\'use asm\' \n \'use strict\'',
        '"use asm" \n "use strict"',
        '\'use asm\' \r \'use strict\'',
        '"use asm" \r "use strict"',
        '\'use asm\' \r\n \'use strict\'',
        '"use asm" \r\n "use strict"',
        '\'use asm\' \u2028 \'use strict\'',
        '"use asm" \u2028 "use strict"',
        '\'use asm\' \u2029 \'use strict\'',
        '"use asm" \u2029 "use strict"',
        'function foo() { "use \\u0020strict"; with (a) b = c; }',
        '"use \\u0020strict"; function foo() { with (a) b = c; }',
        '"use strict"\n foo',
        '\'use strict\'; foo',
        'function foo() { "use strict"\n bar }',
        '!function foo() { "use strict"\n bar }',
        '() => { "use strict"\n foo }',
        '() => "use strict"',
        '({ wrap() { "use strict"; foo } })',
        '"\\u0075se strict"',
        '"use asm"; "use strict"; foo',
        "var public = 1; 'use strict'; var anotherVariableNotReserveWord = 2;",
        "var public = 1; var anotherVariableNotReserveWord = 2; 'use strict';",
        'function wrap() { "use asm"; "use strict"; foo }',
        '"use strict"; foo; "use asm"',
        'function wrap() { "use asm"; foo; "use strict" }',
        '{ "use strict"; }',
        'function wrap() { { "use strict" } foo }',
        '("use strict"); foo',
        'function wrap() { ("use strict"); foo }',
        'function a() { "use strict" } "use strict"; foo',
        'function a(a = function() { "use strict"; foo }) { "use strict" }',
        'function foo(){ "use strict" }',
        "function foo(){\n'foo';\n}",
        'function foo(){\n"foo";\n}',
        'function foo(){\n"foo"\n}',
        "function foo(){\n'foo';\n'bar';\n}",
        'function foo(){\n\'foo\';\n"bar";\n}',
        'function foo(){\n"foo";\n\'bar\';\n}',
        'function foo(){\n"foo"\n// hello\n"bar";\n}',
        'function f(oo){\n"foo";/*abc\nxyz*/"bar";\n}',
        'try { "use strict"; var public = 1; } catch (e) {}',
        "'foo';",
        '"foo";',
        '"foo"\nx',
        '"foo";"bar";',
        '"foo";\n"bar";',
        "'foo';\n'bar';",
        '\'foo\';\n"bar";',
        '"foo";\n\'bar\';',
        '"foo"\n// stuff here\n"bar";',
        '"foo";/*abc\nxyz*/"bar";',
        '"foo"/*abc\nxyz*/"bar";',
        '"ignore me" + x',
        '"ignore me"\n+ x',
        '"ignore me"\n/x/g',
        '"ignore me" = x',
        'x => { "use strict"; }',
        'async x => { "use strict"; }',
        'function* f() { "use strict"; }',
        `function foo()
        {
           "bogus directive";
           "use strict";
           return (this === undefined);
        }`
      ];

      for (const arg of validSyntax) {

          it(`${arg}`, () => {
              t.doesNotThrow(() => {
                  parseSource(`${arg}`, undefined, Context.Empty);
              });
          });
      }

      pass('"use strict;"', Context.OptionsLoc, {
        source: `"use strict;"`,
        expected: {
          "type": "Program",
          "sourceType": "script",
          "body": [
              {
                  "type": "ExpressionStatement",
                  "expression": {
                      "type": "Literal",
                      "value": "use strict;",
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 0
                          },
                          "end": {
                              "line": 1,
                              "column": 13
                          }
                      }
                  },
                  "directive": "use strict;",
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 0
                      },
                      "end": {
                          "line": 1,
                          "column": 13
                      }
                  }
              }
          ],
          "loc": {
              "start": {
                  "line": 1,
                  "column": 0
              },
              "end": {
                  "line": 1,
                  "column": 13
              }
          }
      }
      });

        pass('"use asm;"', Context.Empty, {
            source: `"use asm;"`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "Literal",
                            "value": "use asm;"
                        },
                        "directive": "use asm;"
                    }
                ]
            }

        });
    });
});
