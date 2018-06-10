import * as t from 'assert';
import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Miscellaneous - Async Generator', () => {

    describe('Failure', () => {

        const Failures = [
            'var yield;',
            'var await;',
        ];

        for (const arg of Failures) {
            it(`"use strict"; ${arg}`, () => {
                t.throws(() => {
                    parseSource(`"use strict"; ${arg}`, undefined, Context.Empty);
                });
            });
        }

        fail('async function foo (foo = super()) { let bar; }', Context.Empty, {
            source: 'async function foo (foo = super()) { let bar; }',
          });
    });

    describe('Pass', () => {

        const programs = [
            'yield 2;',
            'yield * 2;',
            'yield * \n 2;',
            'yield * \r 2;',
            'yield * \t 2;',
            'yield * \n\f\r 2;',
            'yield * \f\n\r 2;',
            'yield yield 1;',
            'yield * yield * 1;',
            'yield 3 + (yield 4);',
            'yield 3 + (yield 4) + 4;',
            'yield * 3 + (yield * 4);',
            '(yield * 3) + (yield * 4);',
            'yield 3; yield 4;',
            'yield * 3; yield * 4;',
            //'(function (yield) { })',
            '(function yield() { })',
//            '(function (await) { })',
            '(function await() { })',
            'yield { yield: 12 }',
            'yield /* comment */ { yield: 12 }',
            'class C extends await { }',
            'yield * \n { yield: 12 }',
            'yield /* comment */ * \n { yield: 12 }',
            'yield 1; return',
            'yield 1; return;',
            'yield * 1; return',
            'yield * 1; return;',
            'yield 1; return 7',
            'yield * 1; return 7',
            'yield 1; return 7; yield \'foo\';',
            'yield * 1; return 3; yield * \'foo\';',
            '({ yield: 1 })',
            '({ yield })',
//            '({ get yield() { } })',
            '({ await: 1 })',
            '({ get await() { } })',
            '({ [yield]: x } = { })',
            '({ [await 1]: x } = { })',
            'yield',
            'yield\n',
            'yield /* comment */',
            'yield // comment\n',
            'yield // comment\n\r\f',
            '(yield)',
            '[yield]',
            '{yield}',
            'yield, yield',
            'yield; yield',
            'yield; yield; yield; yield;',
            '(yield) ? yield : yield',
            '(yield) \n ? yield : yield',
            'yield\nfor (;;) {}',
            'await 10',
            'await 10; return',
            'await 10; return 20',
            'await 10; return 20; yield \'foo\'',
            'await (yield 10)',
            'await (  yield     10  ) ',
            'await (yield 10); return',
            'await (yield 10); return 80',
            'await (yield 10); return 50; yield \'foo\'',
            'yield await 10',
            'yield await 10; return',
            'yield await 10; return;',
            'yield await 10; return 10',
            'yield await 10; return 10; yield \'foo\'',
            'await /* comment */ 10',
            'await // comment\n 10',
            'yield await /* comment\n */ 10',
            'yield await // comment\n 10',
            'await (yield /* comment */)',
            'await (yield // comment\n)',
            'for await (x of xs);',
            'for await (let x of xs);',
            'await a; yield b;',
        ];

        for (const arg of programs) {
            it(`async function * gen() { ${arg} }`, () => {
                t.doesNotThrow(() => {
                    parseSource(`async function * gen() { ${arg} }`, undefined, Context.Empty);
                });
            });

            it(`(async function * () { ${arg} })`, () => {
              t.doesNotThrow(() => {
               parseSource(`(async function * () { ${arg} })`, undefined, Context.Empty);
             });
             });

            it(`(async function * gen() { ${arg} })`, () => {
              t.doesNotThrow(() => {
                parseSource(`(async function * gen() { ${arg} })`, undefined, Context.Empty);
            });
            });

            it(`({ async * gen () { ${arg} } })`, () => {
              t.doesNotThrow(() => {
                parseSource(`({ async * gen () { ${arg} } })`, undefined, Context.Empty);
            });

            });
        }


        pass('class A { async f() { for await (x of xs); } }', Context.Empty, {
            source: 'class A { async f() { for await (x of xs); } }',
            expected: {
                  body: [
                    {
                     body: {
                        body: [
                          {
                            computed: false,
                            key: {
                              name: 'f',
                              type: 'Identifier'
                            },
                            kind: 'method',
                            static: false,
                            type: 'MethodDefinition',
                            value: {
                              async: true,
                             body: {
                                body: [
                                  {
                                    await: true,
                                    body: {
                                      type: 'EmptyStatement',
                                    },
                                    left: {
                                      name: 'x',
                                      type: 'Identifier',
                                    },
                                    right: {
                                      name: 'xs',
                                      type: 'Identifier',
                                    },
                                    type: 'ForOfStatement',
                                  },
                                ],
                                type: 'BlockStatement',
                              },
                              expression: false,
                              generator: false,
                              id: null,
                              params: [],
                              type: 'FunctionExpression'
                            }
                          }
                        ],
                        type: 'ClassBody',
                      },
                      id: {
                        name: 'A',
                        type: 'Identifier',
                      },
                      superClass: null,
                      type: 'ClassDeclaration'
                    },
                  ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

        pass('f = async function() { for await (x of xs); }', Context.Empty, {
            source: 'f = async function() { for await (x of xs); }',
            expected: {
                  body: [
                    {
                      expression: {
                        left: {
                          name: 'f',
                          type: 'Identifier'
                        },
                        operator: '=',
                       right: {
                          async: true,
                          body: {
                            body: [
                              {
                               await: true,
                                body: {
                                 type: 'EmptyStatement',
                                },
                                left: {
                                  name: 'x',
                                  type: 'Identifier',
                                },
                                right: {
                                  name: 'xs',
                                  type: 'Identifier',
                                },
                                type: 'ForOfStatement',
                              }
                            ],
                            type: 'BlockStatement',
                          },
                          expression: false,
                          generator: false,
                          id: null,
                          params: [],
                          type: 'FunctionExpression'
                        },
                        type: 'AssignmentExpression'
                      },
                      type: 'ExpressionStatement'
                   },
                  ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

        pass(`x = async() => { for await (x of xs); }`, Context.Empty, {
            source: `x = async() => { for await (x of xs); }`,
            expected: {
                  body: [
                    {
                      expression: {
                        left: {
                          name: 'x',
                          type: 'Identifier'
                        },
                       operator: '=',
                        right: {
                          async: true,
                          body: {
                            body: [
                              {
                                await: true,
                                body: {
                                  type: 'EmptyStatement',
                                },
                                left: {
                                  name: 'x',
                                  type: 'Identifier',
                                },
                                right: {
                                  name: 'xs',
                                  type: 'Identifier',
                               },
                                type: 'ForOfStatement',
                              }
                            ],
                            type: 'BlockStatement'
                          },
                          expression: false,
                          generator: false,
                          id: null,
                          params: [],
                          type: 'ArrowFunctionExpression'
                        },
                        type: 'AssignmentExpression'
                      },
                      type: 'ExpressionStatement'
                    }
                 ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

        pass('obj = { async f() { for await (x of xs); } }', Context.Empty, {
            source: 'obj = { async f() { for await (x of xs); } }',
            expected: {
                  body: [
                    {
                      expression: {
                        left: {
                          name: 'obj',
                          type: 'Identifier'
                        },
                        operator: '=',
                        right: {
                          properties: [
                            {
                              computed: false,
                              key: {
                                name: 'f',
                                type: 'Identifier',
                              },
                              kind: 'init',
                              method: true,
                              shorthand: false,
                              type: 'Property',
                              value: {
                               async: true,
                                body: {
                                  body: [
                                    {
                                      await: true,
                                      body: {
                                        type: 'EmptyStatement',
                                      },
                                      left: {
                                        name: 'x',
                                        type: 'Identifier',
                                      },
                                      right: {
                                        name: 'xs',
                                        type: 'Identifier',
                                      },
                                      type: 'ForOfStatement',
                                    },
                                  ],
                                  type: 'BlockStatement',
                                },
                                expression: false,
                                generator: false,
                                id: null,
                                params: [],
                                type: 'FunctionExpression'
                              }
                            }
                          ],
                          type: 'ObjectExpression',
                        },
                        type: 'AssignmentExpression'
                      },
                      type: 'ExpressionStatement'
                    }
                  ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

        pass(`async function f() { for\nawait (x of xs); }`, Context.Empty, {
            source: `async function f() { for\nawait (x of xs); }`,
            expected: {
                  body: [
                    {
                      async: true,
                      body: {
                        body: [
                          {
                            await: true,
                            body: {
                              type: 'EmptyStatement'
                            },
                           left: {
                              name: 'x',
                              type: 'Identifier',
                            },
                            right: {
                              name: 'xs',
                              type: 'Identifier'
                            },
                            type: 'ForOfStatement',
                          },
                        ],
                       type: 'BlockStatement'
                      },
                     expression: false,
                      generator: false,
                      id: {
                       name: 'f',
                        type: 'Identifier',
                      },
                      params: [],
                      type: 'FunctionDeclaration',
                    },
                  ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

 });

});
