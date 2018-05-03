import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/utilities';
import * as t from 'assert';
import { parse } from '../../../src/parser/parser';

describe('Experimental - Decorators', () => {

    describe('Failure', () => {

        const inValidSyntax = [
            `class A {  constructor(@foo x) {} }`,
            `@decorate`,
            `class A { @dec name = 0 }`,
            `class A { @abc @abc @abc }`,
             `class A {
                @abc
            constructor(){}
        }`,
            `var o = {
                @baz
                foo() {
                }
              }`,
            `class A {
                @a;
                m(){}
              }`,
            `var obj = {
                method(@foo x) {}
              };`,
            `class A { @dec static name = 0 }`,
            /*`@(bar.baz)
            class Foo {}`,
            `@foo().bar
            class Baz {}`, */
            `class A { @dec name = 0 }`,
            `class A { @dec name = 0 }`,
            `class A { @dec name = 0 }`,
            `class A { @dec name = 0 }`,
            `class A { @dec name = 0 }`,

        ];

        for (const arg of inValidSyntax) {
            it(`${arg}`, () => {
                t.throws(() => {
                    parse(`${arg}`, undefined, Context.OptionsExperimental);
                });
            });
        }
    });

    describe('Pass', () => {

        const validSyntax = [
            `class A { @foo get getter(){} }`,
            `class A { @foo set setter(_val){} }`,
            `class A { @foo async a(){} }`,
            `@foo('bar')
            class Foo {}`,
            `@abc class Foo {}`,
            `class A {
                @dec *m(){}
              }`,
            `class A {
                @a.b.c.d(e, f)
                m(){}
              }`,
            `class A { @foo async a(){} }`,
            `class Foo {
                @dec
                static bar() {}
              }`
        ];

        for (const arg of validSyntax) {
            it(`${arg}`, () => {
                t.doesNotThrow(() => {
                    parse(`${arg}`, undefined, Context.OptionsExperimental);
                });
            });
        }

        pass(`@defineElement('num-counter')`, Context.OptionsExperimental | Context.OptionsNext, {
            source: `@defineElement('num-counter')
            class Counter extends HTMLElement {
                @observed #x = 0;

                @bound
                #clicked() {
                    this.#x++;
                }

                constructor() {
                    super();
                    this.onclick = this.#clicked;
                  }

                  connectedCallback() { this.render(); }

                  @bound
                  render() {
                    this.textContent = this.#x.toString();
                  }
            }`,
            expected: {
                  body: [
                    {
                      body: {
                        body: [
                          {
                            computed: false,
                           decorators: [
                              {
                                expression: {
                                  name: 'observed',
                                 type: 'Identifier',
                                },
                                type: 'Decorator',
                              }
                            ],
                            key: {
                              name: 'x',
                              type: 'PrivateName',
                            },
                            static: false,
                            type: 'FieldDefinition',
                            value: {
                              type: 'Literal',
                              value: 0,
                            }
                          },
                          {
                            computed: false,
                            decorators: undefined,
                            key: {
                              name: 'clicked',
                              type: 'PrivateName'
                            },
                            kind: 'method',
                            static: false,
                            type: 'MethodDefinition',
                            value: {
                              async: false,
                              body: {
                                body: [
                                  {
                                    expression: {
                                      argument: {
                                        computed: false,
                                        object: {
                                          type: 'ThisExpression'
                                        },
                                        property: {
                                          name: 'x',
                                          type: 'PrivateName',
                                        },
                                        type: 'MemberExpression',
                                      },
                                      operator: '++',
                                      prefix: false,
                                      type: 'UpdateExpression'
                                    },
                                    type: 'ExpressionStatement'
                                  }
                                ],
                                type: 'BlockStatement'
                              },
                              expression: false,
                              generator: false,
                              id: null,
                              params: [],
                              type: 'FunctionExpression'
                            }
                         },
                          {
                            computed: false,
                           decorators: [],
                            key: {
                              name: 'constructor',
                              type: 'Identifier',
                            },
                            kind: 'constructor',
                            static: false,
                            type: 'MethodDefinition',
                            value: {
                              async: false,
                              body: {
                                body: [
                                  {
                                    expression: {
                                      arguments: [],
                                      callee: {
                                        type: 'Super',
                                      },
                                      type: 'CallExpression',
                                    },
                                    type: 'ExpressionStatement',
                                  },
                                  {
                                    expression: {
                                      left: {
                                        computed: false,
                                        object: {
                                          type: 'ThisExpression',
                                        },
                                       property: {
                                          name: 'onclick',
                                          type: 'Identifier',
                                       },
                                        type: 'MemberExpression',
                                      },
                                      operator: '=',
                                      right: {
                                        computed: false,
                                        object: {
                                          type: 'ThisExpression'
                                        },
                                        property: {
                                          name: 'clicked',
                                          type: 'PrivateName',
                                        },
                                        type: 'MemberExpression'
                                      },
                                      type: 'AssignmentExpression'
                                    },
                                    type: 'ExpressionStatement'
                                  }
                                ],
                                type: 'BlockStatement'
                              },
                              expression: false,
                              generator: false,
                              id: null,
                              params: [],
                              type: 'FunctionExpression'
                            }
                          },
                          {
                            computed: false,
                            decorators: [],
                            key: {
                              name: 'connectedCallback',
                              type: 'Identifier'
                            },
                            kind: 'method',
                            static: false,
                            type: 'MethodDefinition',
                            value: {
                              async: false,
                              body: {
                                body: [
                                  {
                                    expression: {
                                      arguments: [],
                                      callee: {
                                        computed: false,
                                        object: {
                                          type: 'ThisExpression'
                                        },
                                        property: {
                                          name: 'render',
                                          type: 'Identifier'
                                        },
                                        type: 'MemberExpression'
                                      },
                                      type: 'CallExpression'
                                    },
                                    type: 'ExpressionStatement'
                                  },
                                ],
                                type: 'BlockStatement'
                              },
                              expression: false,
                              generator: false,
                              id: null,
                              params: [],
                              type: 'FunctionExpression'
                            }
                          },
                          {
                            computed: false,
                            decorators: [
                              {
                                expression: {
                                  name: 'bound',
                                  type: 'Identifier',
                                },
                                type: 'Decorator'
                              }
                            ],
                            key: {
                              name: 'render',
                              type: 'Identifier',
                            },
                            kind: 'method',
                            static: false,
                            type: 'MethodDefinition',
                           value: {
                              async: false,
                              body: {
                                body: [
                                  {
                                    expression: {
                                      left: {
                                        computed: false,
                                        object: {
                                          type: 'ThisExpression',
                                        },
                                        property: {
                                          name: 'textContent',
                                          type: 'Identifier',
                                        },
                                        type: 'MemberExpression',
                                      },
                                      operator: '=',
                                      right: {
                                        arguments: [],
                                        callee: {
                                          computed: false,
                                          object: {
                                            computed: false,
                                            object: {
                                              type: 'ThisExpression'
                                            },
                                            property: {
                                              name: 'x',
                                              type: 'PrivateName'
                                            },
                                            type: 'MemberExpression',
                                          },
                                          property: {
                                            name: 'toString',
                                            type: 'Identifier',
                                          },
                                          type: 'MemberExpression'
                                        },
                                        type: 'CallExpression'
                                      },
                                      type: 'AssignmentExpression'
                                    },
                                    type: 'ExpressionStatement'
                                  },
                               ],
                                type: 'BlockStatement',
                              },
                              expression: false,
                              generator: false,
                              id: null,
                              params: [],
                              type: 'FunctionExpression',
                            }
                          }
                        ],
                        type: 'ClassBody',
                      },
                      decorators: [
                        {
                          expression: {
                            arguments: [
                              {
                                type: 'Literal',
                                value: 'num-counter',
                              },
                            ],
                            callee: {
                              name: 'defineElement',
                              type: 'Identifier',
                            },
                            type: 'CallExpression'
                          },
                          type: 'Decorator'
                        }
                      ],
                      id: {
                        name: 'Counter',
                        type: 'Identifier',
                      },
                      superClass: {
                        name: 'HTMLElement',
                        type: 'Identifier',
                      },
                      type: 'ClassDeclaration'
                   }
                  ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

        pass(`@defineElement('num-counter')`, Context.OptionsExperimental | Context.OptionsNext, {
            source: `@defineElement('num-counter')
            class Counter extends HTMLElement {
                @observed #x = 0;
            }`,
            expected: {
                  body: [
                    {
                      body: {
                        body: [
                         {
                            computed: false,
                            decorators: [
                              {
                                expression: {
                                  name: 'observed',
                                  type: 'Identifier',
                                },
                                type: 'Decorator',
                              },
                            ],
                           key: {
                              name: 'x',
                              type: 'PrivateName',
                            },
                            static: false,
                            type: 'FieldDefinition',
                           value: {
                              type: 'Literal',
                              value: 0,
                            }
                          }
                        ],
                        type: 'ClassBody'
                      },
                      decorators: [
                        {
                          expression: {
                            arguments: [
                              {
                                type: 'Literal',
                                value: 'num-counter'
                              },
                            ],
                            callee: {
                              name: 'defineElement',
                             type: 'Identifier',
                            },
                            type: 'CallExpression',
                          },
                          type: 'Decorator'
                        }
                      ],
                     id: {
                        name: 'Counter',
                        type: 'Identifier',
                      },
                      superClass: {
                        name: 'HTMLElement',
                        type: 'Identifier',
                      },
                      type: 'ClassDeclaration'
                    }
                  ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

        pass(`export default
        @bar class Foo { }
          }`, Context.OptionsExperimental | Context.Module, {
            source: `export default
            @bar class Foo { }`,
            expected: {
                  body: [
                    {
                      declaration: {
                        body: {
                          body: [],
                          type: 'ClassBody',
                        },
                        decorators: [
                         {
                            expression: {
                              name: 'bar',
                              type: 'Identifier',
                            },
                            type: 'Decorator',
                          },
                        ],
                        id: {
                          name: 'Foo',
                          type: 'Identifier',
                       },
                        superClass: null,
                        type: 'ClassDeclaration'
                      },
                      type: 'ExportDefaultDeclaration'
                    }
                  ],
                  sourceType: 'module',
                  type: 'Program'
                }
        });

        pass(`class Foo {
            @d1 method1(){};
          }`, Context.OptionsExperimental, {
            source: `class Foo {
                @d1 method1(){};
              }`,
            expected: {
                  body: [
                    {
                      body: {
                        body: [
                          {
                            computed: false,
                            decorators: [
                              {
                                expression: {
                                  name: 'd1',
                                  type: 'Identifier',
                                },
                                type: 'Decorator',
                              },
                            ],
                           key: {
                              name: 'method1',
                              type: 'Identifier',
                            },
                            kind: 'method',
                            static: false,
                            type: 'MethodDefinition',
                            value: {
                              async: false,
                              body: {
                                body: [],
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
                      decorators: [],
                      id: {
                        name: 'Foo',
                        type: 'Identifier',
                     },
                      superClass: null,
                      type: 'ClassDeclaration',
                    },
                  ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

        pass(`@deco1 @deco2() @deco3(foo, bar) @deco4({foo, bar}) class Foo {}`, Context.OptionsExperimental, {
            source: `@deco1 @deco2() @deco3(foo, bar) @deco4({foo, bar}) class Foo {}`,
            expected: {
                  body: [
                    {
                      body: {
                        body: [],
                        type: 'ClassBody'
                      },
                     decorators: [
                        {
                          expression: {
                            name: 'deco1',
                            type: 'Identifier'
                          },
                          type: 'Decorator',
                        },
                        {
                          expression: {
                            arguments: [],
                            callee: {
                              name: 'deco2',
                              type: 'Identifier'
                            },
                            type: 'CallExpression'
                          },
                          type: 'Decorator'
                        },
                        {
                          expression: {
                            arguments: [
                              {
                                name: 'foo',
                                type: 'Identifier'
                              },
                              {
                                name: 'bar',
                                type: 'Identifier'
                              },
                           ],
                            callee: {
                             name: 'deco3',
                              type: 'Identifier',
                           },
                            type: 'CallExpression',
                          },
                          type: 'Decorator'
                        },
                        {
                          expression: {
                            arguments: [
                              {
                                properties: [
                                  {
                                   computed: false,
                                    key: {
                                      name: 'foo',
                                      type: 'Identifier'
                                    },
                                    kind: 'init',
                                    method: false,
                                    shorthand: true,
                                    type: 'Property',
                                    value: {
                                      name: 'foo',
                                      type: 'Identifier'
                                    }
                                  },
                                  {
                                    computed: false,
                                    key: {
                                      name: 'bar',
                                      type: 'Identifier'
                                    },
                                    kind: 'init',
                                    method: false,
                                    shorthand: true,
                                    type: 'Property',
                                    value: {
                                      name: 'bar',
                                      type: 'Identifier'
                                    }
                                  }
                                ],
                                type: 'ObjectExpression'
                              }
                            ],
                            callee: {
                              name: 'deco4',
                              type: 'Identifier'
                           },
                            type: 'CallExpression'
                         },
                          type: 'Decorator'
                        }
                      ],
                      id: {
                        name: 'Foo',
                        type: 'Identifier',
                      },
                      superClass: null,
                      type: 'ClassDeclaration'
                    }
                  ],
                  sourceType: 'script',
                  type: 'Program'
                }
        });

        pass(`@decorate
        class Foo {}`, Context.OptionsExperimental, {
            source: `@decorate
            class Foo {}`,
            expected: {
                  body: [
                    {
                      body: {
                        body: [],
                        type: 'ClassBody'
                      },
                      decorators: [
                        {
                          expression: {
                            name: 'decorate',
                            type: 'Identifier',
                          },
                          type: 'Decorator'
                       },
                      ],
                      id: {
                        name: 'Foo',
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
    });

    pass(`class A {
        @dec static name = 0
      }`, Context.OptionsExperimental | Context.OptionsNext, {
        source: `class A {
            @dec static name = 0
          }`,
        expected: {
            type: 'Program',
            sourceType: 'script',
            body: [
                {
                    type: 'ClassDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'A'
                    },
                    superClass: null,
                    body: {
                        type: 'ClassBody',
                        body: [
                            {
                                type: 'FieldDefinition',
                                key: {
                                    type: 'Identifier',
                                    name: 'name'
                                },
                                value: {
                                    type: 'Literal',
                                    value: 0
                                },
                                computed: false,
                                decorators: [
                                                  {
                                                    expression: {
                                                      name: 'dec',
                                                      type: 'Identifier',
                                                    },
                                                    type: 'Decorator'
                                                  }
                                                ],
                                static: true
                            }
                        ]
                    },
                    decorators: []
                }
            ]
        }
    });

    pass(`@foo('bar')
    class Foo {}`, Context.OptionsExperimental, {
        source: `@foo('bar')
        class Foo {}`,
        expected: {
            type: 'Program',
            sourceType: 'script',
            body: [
                {
                    type: 'ClassDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'Foo'
                    },
                    superClass: null,
                    body: {
                        type: 'ClassBody',
                        body: []
                    },
                    decorators: [
                        {
                            type: 'Decorator',
                            expression: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'foo'
                                },
                                arguments: [
                                    {
                                        type: 'Literal',
                                        value: 'bar'
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    });

    pass(`class Foo {
        @dec
        static bar() {}
      }`, Context.OptionsExperimental, {
        source: `class Foo {
            @dec
            static bar() {}
          }`,
        expected: {
            type: 'Program',
            sourceType: 'script',
            body: [
                {
                    type: 'ClassDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'Foo'
                    },
                    superClass: null,
                    body: {
                        type: 'ClassBody',
                        body: [
                            {
                                type: 'MethodDefinition',
                                kind: 'method',
                                static: true,
                                computed: false,
                                key: {
                                    type: 'Identifier',
                                    name: 'bar'
                                },
                                value: {
                                    type: 'FunctionExpression',
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: []
                                    },
                                    async: false,
                                    generator: false,
                                    expression: false,
                                    id: null
                                },
                                decorators: [
                                    {
                                        type: 'Decorator',
                                        expression: {
                                            type: 'Identifier',
                                            name: 'dec'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    decorators: []
                }
            ]
        }
    });

    pass(`@(foo().bar)
    class Foo {
      @(member[expression]) method() {}

      @(foo + bar) method2() {}
    }`, Context.OptionsExperimental, {
        source: `@(foo().bar)
        class Foo {
          @(member[expression]) method() {}

          @(foo + bar) method2() {}
        }`,
        expected: {
            type: 'Program',
            sourceType: 'script',
            body: [
                {
                    type: 'ClassDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'Foo'
                    },
                    superClass: null,
                    body: {
                        type: 'ClassBody',
                        body: [
                            {
                                type: 'MethodDefinition',
                                kind: 'method',
                                static: false,
                                computed: false,
                                key: {
                                    type: 'Identifier',
                                    name: 'method'
                                },
                                value: {
                                    type: 'FunctionExpression',
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: []
                                    },
                                    async: false,
                                    generator: false,
                                    expression: false,
                                    id: null
                                },
                                decorators: [
                                    {
                                        type: 'Decorator',
                                        expression: {
                                            type: 'MemberExpression',
                                            object: {
                                                type: 'Identifier',
                                                name: 'member'
                                            },
                                            computed: true,
                                            property: {
                                                type: 'Identifier',
                                                name: 'expression'
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                type: 'MethodDefinition',
                                kind: 'method',
                                static: false,
                                computed: false,
                                key: {
                                    type: 'Identifier',
                                    name: 'method2'
                                },
                                value: {
                                    type: 'FunctionExpression',
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: []
                                    },
                                    async: false,
                                    generator: false,
                                    expression: false,
                                    id: null
                                },
                                decorators: [
                                    {
                                        type: 'Decorator',
                                        expression: {
                                            type: 'BinaryExpression',
                                            left: {
                                                type: 'Identifier',
                                                name: 'foo'
                                            },
                                            right: {
                                                type: 'Identifier',
                                                name: 'bar'
                                            },
                                            operator: '+'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    decorators: [
                        {
                            type: 'Decorator',
                            expression: {
                                type: 'MemberExpression',
                                object: {
                                    type: 'CallExpression',
                                    callee: {
                                        type: 'Identifier',
                                        name: 'foo'
                                    },
                                    arguments: []
                                },
                                computed: false,
                                property: {
                                    type: 'Identifier',
                                    name: 'bar'
                                }
                            }
                        }
                    ]
                }
            ]
        }
    });

    pass(`class A {
        @dec #name = 0
      }`, Context.OptionsExperimental | Context.OptionsNext, {
        source: `class A {
            @dec #name = 0
          }`,
        expected: {
            type: 'Program',
            sourceType: 'script',
            body: [
                {
                    type: 'ClassDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'A'
                    },
                    superClass: null,
                    body: {
                        type: 'ClassBody',
                        body: [
                            {
                                type: 'FieldDefinition',
                                key: {
                                    type: 'PrivateName',
                                    name: 'name'
                                },
                                value: {
                                    type: 'Literal',
                                    value: 0
                                },
                                computed: false,
                                static: false,
                                decorators: [
                                    {
                                        type: 'Decorator',
                                        expression: {
                                            type: 'Identifier',
                                            name: 'dec'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    decorators: []
                }
            ]
        }
    });

    pass(`class A {
        @foo get getter(){}
      }`, Context.OptionsExperimental, {
        source: `class A {
            @foo get getter(){}
          }`,
        expected: {
            type: 'Program',
            sourceType: 'script',
            body: [
                {
                    type: 'ClassDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'A'
                    },
                    superClass: null,
                    body: {
                        type: 'ClassBody',
                        body: [
                            {
                                type: 'MethodDefinition',
                                kind: 'get',
                                static: false,
                                computed: false,
                                key: {
                                    type: 'Identifier',
                                    name: 'getter'
                                },
                                value: {
                                    type: 'FunctionExpression',
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: []
                                    },
                                    async: false,
                                    generator: false,
                                    expression: false,
                                    id: null
                                },
                                decorators: [
                                    {
                                        type: 'Decorator',
                                        expression: {
                                            type: 'Identifier',
                                            name: 'foo'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    decorators: []
                }
            ]
        }
    });

    pass(`export @bar class Foo { }`, Context.OptionsExperimental | Context.Module, {
        source: `export @bar class Foo { }`,
        expected: {
              body: [
               {
                  declaration: {
                    body: {
                      body: [],
                      type: 'ClassBody'
                   },
                    decorators: [
                      {
                        expression: {
                          name: 'bar',
                          type: 'Identifier',
                        },
                       type: 'Decorator',
                      },
                    ],
                    id: {
                      name: 'Foo',
                     type: 'Identifier',
                    },
                    superClass: null,
                    type: 'ClassDeclaration'
                  },
                  source: null,
                  specifiers: [],
                  type: 'ExportNamedDeclaration'
                }
              ],
              sourceType: 'module',
              type: 'Program'
            }
    });

    pass(`class Foo {
        @bar [bizz]
        abc() {

        }
      }`, Context.OptionsExperimental | Context.OptionsNext, {
        source: `class Foo {
            @bar [bizz]
            abc() {
          
            }
          }`,
        expected: {
            type: 'Program',
            sourceType: 'script',
            body: [
                {
                    type: 'ClassDeclaration',
                    id: {
                        type: 'Identifier',
                        name: 'Foo'
                    },
                    superClass: null,
                    body: {
                        type: 'ClassBody',
                        body: [
                            {
                                type: 'MethodDefinition',
                                kind: 'method',
                                static: false,
                                computed: false,
                                key: {
                                    type: 'Identifier',
                                    name: 'abc'
                                },
                                value: {
                                    type: 'FunctionExpression',
                                    params: [],
                                    body: {
                                        type: 'BlockStatement',
                                        body: []
                                    },
                                    async: false,
                                    generator: false,
                                    expression: false,
                                    id: null
                                },
                                decorators: [
                                    {
                                        type: 'Decorator',
                                        expression: {
                                            type: 'MemberExpression',
                                            object: {
                                                type: 'Identifier',
                                                name: 'bar'
                                            },
                                            computed: true,
                                            property: {
                                                type: 'Identifier',
                                                name: 'bizz'
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    decorators: []
                }
            ]
        }
    });
});