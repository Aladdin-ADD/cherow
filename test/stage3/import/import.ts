import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/cherow';

describe('Next - Import meta', () => {
  fail('Next - Import', [
    ['function failsParse() { return import.then(); }', Context.Empty],
    ['import(x, y).then(z);', Context.Empty],
    ['import.then(doLoad);', Context.Empty],
    ['import(', Context.Empty],
    ['import)', Context.Empty],
    ['import()', Context.Empty],
    ["import('x", Context.Empty],
    ["import('x']", Context.Empty],
    ["import['x')", Context.Empty],
    ['import = x', Context.Empty],
    ['import[', Context.Empty],
    ['import[]', Context.Empty],
    ['import]', Context.Empty],
    ['import[x]', Context.Empty],
    ['import{', Context.Empty],
    ['import{x', Context.Empty],
    ['import{x}', Context.Empty],
    ['import(x, y)', Context.Empty],
    ['import(...y)', Context.Empty],
    ['import(x,)', Context.Empty],
    ['import(,)', Context.Empty],
    ['import(,y)', Context.Empty],
    ['import(;)', Context.Empty],
    // ['[import]', Context.Empty],
    ['{import}', Context.Empty],
    ['import+', Context.Empty],
    ['import = 1', Context.Empty],
    ['import.wat', Context.Empty],
    ['new import(x)', Context.Empty]
  ]);

  const validSyntax = [
    'import(1)',
    'import(y=x)',
    'f(...[import(y=x)])',
    'x = {[import(y=x)]: 1}',
    'var {[import(y=x)]: x} = {}',
    '({[import(y=x)]: x} = {})',
    'async () => { await import(x) }',
    'const importResult = import("test.js");',
    'let Layout = () => import("../foo/bar/zoo.js")',
    'import("lib.js").then(doThis);',
    'function* a() { yield import("http"); }',
    '"use strict"; import("test.js");',
    'function loadImport(file) { return import(`test/${file}.js`); }',
    '() => { import(x) }',
    '(import(y=x))',
    '{import(y=x)}',
    `import('./module.js')`,
    'import(import(x))',
    'x = import(x)',
    'var x = import(x)',
    'let x = import(x)',
    'for(x of import(x)) {}',
    'import(x).then()'
  ];
  for (const arg of validSyntax) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module | Context.OptionsNext);
      });
    });
  }
  pass('Next - Import.Meta (pass)', [
    [
      `function* a() { yield import("http"); }`,
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            async: false,
            body: {
              body: [
                {
                  expression: {
                    argument: {
                      arguments: [
                        {
                          type: 'Literal',
                          value: 'http'
                        }
                      ],
                      callee: {
                        type: 'Import'
                      },
                      type: 'CallExpression'
                    },
                    delegate: false,
                    type: 'YieldExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },
            generator: true,
            id: {
              name: 'a',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `import foo, * as namespace from "./namespace/drink.js"`,
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            source: {
              type: 'Literal',
              value: './namespace/drink.js'
            },
            specifiers: [
              {
                local: {
                  name: 'foo',
                  type: 'Identifier'
                },
                type: 'ImportDefaultSpecifier'
              },
              {
                local: {
                  name: 'namespace',
                  type: 'Identifier'
                },
                type: 'ImportNamespaceSpecifier'
              }
            ],
            type: 'ImportDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `for(x of import(x)) {}`,
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            await: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },
            left: {
              name: 'x',
              type: 'Identifier'
            },
            right: {
              arguments: [
                {
                  name: 'x',
                  type: 'Identifier'
                }
              ],
              callee: {
                type: 'Import'
              },
              type: 'CallExpression'
            },
            type: 'ForOfStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `(import(y=x))`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  left: {
                    name: 'y',
                    type: 'Identifier'
                  },
                  operator: '=',
                  right: {
                    name: 'x',
                    type: 'Identifier'
                  },
                  type: 'AssignmentExpression'
                }
              ],
              callee: {
                type: 'Import'
              },
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `var {[import(y=x)]: x} = {}`,
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  properties: [
                    {
                      computed: true,
                      key: {
                        arguments: [
                          {
                            left: {
                              name: 'y',
                              type: 'Identifier'
                            },
                            operator: '=',
                            right: {
                              name: 'x',
                              type: 'Identifier'
                            },
                            type: 'AssignmentExpression'
                          }
                        ],
                        callee: {
                          type: 'Import'
                        },
                        type: 'CallExpression'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        name: 'x',
                        type: 'Identifier'
                      }
                    }
                  ],
                  type: 'ObjectPattern'
                },
                init: {
                  properties: [],
                  type: 'ObjectExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],

    [
      `import("lib.js").then(doThis);`,
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  name: 'doThis',
                  type: 'Identifier'
                }
              ],
              callee: {
                computed: false,
                object: {
                  arguments: [
                    {
                      type: 'Literal',
                      value: 'lib.js'
                    }
                  ],
                  callee: {
                    type: 'Import'
                  },
                  type: 'CallExpression'
                },
                property: {
                  name: 'then',
                  type: 'Identifier'
                },
                type: 'MemberExpression'
              },
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ]
  ]);
});
