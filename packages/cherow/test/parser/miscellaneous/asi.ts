import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Miscellaneous - ASI', () => {

  describe('Failures', () => {

      const invalidSyntax = [
          '{ 1 2 } 3',
          '{} * 1',
          '({};) * 1',
          '{} * 1',
          `{}
          * 1`,
          '{1 2} 3',
          'if (false) x = 1 else x = -1',
          'if (false) x = 1 else x = -1',
          `var x = 0;
    if (false) {x = 1};
    else x = -1`,
          `var a=1,b=2,c=3,d;
    if(a>b)
    else c=d`,
          `{} * 1`,
          `for(
      ;) {
        break;
      }`,
          `for(
        false
    ) {
      break;
    }`,
          `for(
        false
        false
        false
    ) {
      break;
    }`,
          `do
      while (false)`,
          `do {};
      while (false)`,
          `
      var x=0, y=0;
      var z=
      x
      ++
      ++
      y`,
          `var x = 0;
      if (false) x = 1 else x = -1`,
          `var x=0, y=0;
      var z=
      x
      ++
      ++
      y`,
          `for(
        false
    ) {
      break;
    }`,
          `for(
      ;false) {
        break;
      }`,
          `for(false;false;;false) {
        break;
      }`,
          `\n while(false)`,
          `do {}; \n while(false)`,
          `for(false
        false
    ) {
      break;
    }`,
          `var a=1,b=2,c=3,d;
          if(a>b)
          else c=d`,
          `try {
            throw
            1;
          } catch(e) {
          }`,
          `var x = 0;
          x
          ++;`,
          `for(;
          ) {
            break;
          }`,
          `for(
            false
        ;) {
          break;
        }`,
          `for(
          ;
      ) {
        break;
      }`,
          `for(
      ) {
        break;
      }`,
          `for(
        false
    ) {
      break;
    }`,
          `for(false;false;;false) {
      break;
    }`,
          `do
          while (false)`,
          `do {};
          while (false)`,
          `do
          while (false)`,
          `for(false;false;;false) {
            break;
          }`,
          `for(
            false
            false
        ) {
          break;
        }`,
          `for(


          ) {
            break;
          }`,
          `for(
            ;false) {
              break;
            }`,
          `for(false
            ;false
        ) {
          break;
        }`,
          `for(false
            ;
        ) {
          break;
        }`,
          `for(false;
            false
            ) {
              break;
            }`,
          `for(false;false
          ) {
            break;
          }`,
          `for(

            ;) {
              break;
            }`,
          `for(


          ) {
            break;
          }`,
          `for(
            ;
        ) {
          break;
        }`,
          `for(
            false
        ;) {
          break;
        }`,
          `for(;
          ) {
            break;
          }`,
          `var x = 0;
          if (false) x = 1 else x = -1`
      ];

      for (const arg of invalidSyntax) {

          it(`${arg}`, () => {
              t.throws(() => {
                  parseSource(`${arg}`, undefined, Context.Empty);
              });
          });

          it(`${arg}`, () => {
              t.throws(() => {
                  parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
              });
          });
      }
  });

  describe('Pass', () => {

    const validSyntax = [
      `{ 1
      2 } 3`,
      `{ 1
        2 } 3`,
      `{ 1
          2 } 3`,
      `{ 1
            2 } 3`,
      `{ 1
              2 } 3`,
      `{ 1
                2 } 3`,
      `{ 1
                  2 } 3`,
      `{ 1
                    2 } 3`,
      `{ 1
                      2 } 3`,
      `var a=1,b=2,c=3;
      a=b
      ++c`,
      `var a=1,b=2,d=4,e=5;

      a=b+c
      (d+e)`,
      `{1} 2`,
      `var x = 0;
      if (false);
      x = 1`,
      `var x = 0;
      if (false) {x = 1}
      else x = -1`,
      `var x =
      1 + (function (t){return {a:t
      }
      })
      (2 + 3).`,
      `for(;;
      ) {
        break;
      }`,
      `for(false
        ;false
        ;false
    ) {
      break;
    }`,
      `for(
        ;;
    ) {
      break;
    }`,
      `var x
      = 1`,
      `var x
      x = 1`,
      `var
      x`,
      `var
      x
      =
      1`,
      `var x
      ,y`,
      `var
      x
      ,y = 1`,
      `;`,
      `do {}
      while (false)`,
  ];

  for (const arg of validSyntax) {

      it(`${arg}`, () => {
          t.doesNotThrow(() => {
              parseSource(`${arg}`, undefined, Context.Empty);
          });
      });
  }

      pass(`x: while(true) { continue x\n; }`, Context.OptionsRaw, {
          source: `    \t \f\v 'abc'  \t `,
          expected: {
              body: [{
                      expression: {
                          raw: '\'abc\'',
                          type: 'Literal',
                          value: 'abc'
                      },
                      type: 'ExpressionStatement',
                      directive: 'abc',
                  },

              ],
              sourceType: 'script',
              type: 'Program'
          }
      });

      pass(`    \t \f\v\n 'abc'  \t `, Context.OptionsRaw, {
          source: `    \t \f\v\n 'abc'  \t `,
          expected: {
              body: [{
                  expression: {
                      raw: '\'abc\'',
                      type: 'Literal',
                      value: 'abc',
                  },
                  type: 'ExpressionStatement',
                  directive: 'abc'
              }, ],
              sourceType: 'script',
              type: 'Program'
          }
      });

      pass(`    \t \f\v\n`, Context.OptionsRaw, {
          source: `    \t \f\v\n`,
          expected: {
              body: [],
              sourceType: 'script',
              type: 'Program'
          }
      });

      pass(`;;1;;1;;1`, Context.OptionsRanges | Context.OptionsLoc | Context.OptionsRaw, {
          source: `;;1;;1;;1`,
          expected: {
              type: 'Program',
              body: [{
                      type: 'EmptyStatement',
                      start: 0,
                      end: 1,
                      loc: {
                          start: {
                              line: 1,
                              column: 0
                          },
                          end: {
                              line: 1,
                              column: 1
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 1,
                      end: 2,
                      loc: {
                          start: {
                              line: 1,
                              column: 1
                          },
                          end: {
                              line: 1,
                              column: 2
                          }
                      }
                  },
                  {
                      type: 'ExpressionStatement',
                      expression: {
                          type: 'Literal',
                          value: 1,
                          start: 2,
                          end: 3,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 2
                              },
                              end: {
                                  line: 1,
                                  column: 3
                              }
                          },
                          raw: '1'
                      },
                      start: 2,
                      end: 4,
                      loc: {
                          start: {
                              line: 1,
                              column: 2
                          },
                          end: {
                              line: 1,
                              column: 4
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 4,
                      end: 5,
                      loc: {
                          start: {
                              line: 1,
                              column: 4
                          },
                          end: {
                              line: 1,
                              column: 5
                          }
                      }
                  },
                  {
                      type: 'ExpressionStatement',
                      expression: {
                          type: 'Literal',
                          value: 1,
                          start: 5,
                          end: 6,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 5
                              },
                              end: {
                                  line: 1,
                                  column: 6
                              }
                          },
                          raw: '1'
                      },
                      start: 5,
                      end: 7,
                      loc: {
                          start: {
                              line: 1,
                              column: 5
                          },
                          end: {
                              line: 1,
                              column: 7
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 7,
                      end: 8,
                      loc: {
                          start: {
                              line: 1,
                              column: 7
                          },
                          end: {
                              line: 1,
                              column: 8
                          }
                      }
                  },
                  {
                      type: 'ExpressionStatement',
                      expression: {
                          type: 'Literal',
                          value: 1,
                          start: 8,
                          end: 9,
                          loc: {
                              start: {
                                  line: 1,
                                  column: 8
                              },
                              end: {
                                  line: 1,
                                  column: 9
                              }
                          },
                          raw: '1'
                      },
                      start: 8,
                      end: 9,
                      loc: {
                          start: {
                              line: 1,
                              column: 8
                          },
                          end: {
                              line: 1,
                              column: 9
                          }
                      }
                  }
              ],
              sourceType: 'script',
              start: 0,
              end: 9,
              loc: {
                  start: {
                      line: 1,
                      column: 0
                  },
                  end: {
                      line: 1,
                      column: 9
                  }
              }
          }
      });

      pass(`;;;;`, Context.OptionsRanges | Context.OptionsLoc | Context.OptionsRaw, {
          source: `;;;;`,
          expected: {
              type: 'Program',
              body: [{
                      type: 'EmptyStatement',
                      start: 0,
                      end: 1,
                      loc: {
                          start: {
                              line: 1,
                              column: 0
                          },
                          end: {
                              line: 1,
                              column: 1
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 1,
                      end: 2,
                      loc: {
                          start: {
                              line: 1,
                              column: 1
                          },
                          end: {
                              line: 1,
                              column: 2
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 2,
                      end: 3,
                      loc: {
                          start: {
                              line: 1,
                              column: 2
                          },
                          end: {
                              line: 1,
                              column: 3
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 3,
                      end: 4,
                      loc: {
                          start: {
                              line: 1,
                              column: 3
                          },
                          end: {
                              line: 1,
                              column: 4
                          }
                      }
                  }
              ],
              sourceType: 'script',
              start: 0,
              end: 4,
              loc: {
                  start: {
                      line: 1,
                      column: 0
                  },
                  end: {
                      line: 1,
                      column: 4
                  }
              }
          }
      });

      pass(';;;;', Context.OptionsRanges | Context.OptionsLoc | Context.OptionsRaw, {
          source: ';;;;',
          expected: {
              type: 'Program',
              start: 0,
              end: 4,
              loc: {
                  start: {
                      line: 1,
                      column: 0
                  },
                  end: {
                      line: 1,
                      column: 4
                  }
              },
              body: [{
                      type: 'EmptyStatement',
                      start: 0,
                      end: 1,
                      loc: {
                          start: {
                              line: 1,
                              column: 0
                          },
                          end: {
                              line: 1,
                              column: 1
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 1,
                      end: 2,
                      loc: {
                          start: {
                              line: 1,
                              column: 1
                          },
                          end: {
                              line: 1,
                              column: 2
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 2,
                      end: 3,
                      loc: {
                          start: {
                              line: 1,
                              column: 2
                          },
                          end: {
                              line: 1,
                              column: 3
                          }
                      }
                  },
                  {
                      type: 'EmptyStatement',
                      start: 3,
                      end: 4,
                      loc: {
                          start: {
                              line: 1,
                              column: 3
                          },
                          end: {
                              line: 1,
                              column: 4
                          }
                      }
                  }
              ],
              sourceType: 'script'
          }
      });

      pass(`function f() { return\n; }`, Context.Empty, {
        source: 'function f() { return\n; }',
        expected: {
              body: [
                {
                  async: false,
                  body: {
                    body: [
                      {
                        argument: null,
                        type: 'ReturnStatement'
                      }
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
                  type: 'FunctionDeclaration'
               }
              ],
              sourceType: 'script',
              type: 'Program'
            }
    });

  pass(`function* f() { yield\n; }`, Context.Empty, {
        source: 'function* f() { yield\n; }',
        expected: {
            body: [
              {
                async: false,
                body: {
                  body: [
                    {
                      expression: {
                        argument: null,
                        delegate: false,
                        type: 'YieldExpression'
                      },
                      type: 'ExpressionStatement',
                    }
                  ],
                  type: 'BlockStatement',
                },
                expression: false,
                generator: true,
                id: {
                  name: 'f',
                  type: 'Identifier',
                },
                params: [],
                type: 'FunctionDeclaration'
              }
            ],
            sourceType: 'script',
            type: 'Program'
          }
    });


    pass(`(0)\n;`, Context.Empty, {
      source: '(0)\n;',
      expected: {
            body: [
              {
                expression: {
                 type: 'Literal',
                  value: 0,
                },
                type: 'ExpressionStatement',
              }
            ],
            sourceType: 'script',
            type: 'Program'
          }
  });

pass(`debugger\n;`, Context.Empty, {
      source: 'debugger\n;',
      expected: {
            body: [
              {
                type: 'DebuggerStatement',
              }
            ],
            sourceType: 'script',
            type: 'Program'
          }
  });

pass(`throw 0\n;`, Context.Empty, {
      source: 'throw 0\n;',
      expected: {
            body: [
              {
                argument: {
                  type: 'Literal',
                  value: 0,
                },
                type: 'ThrowStatement'
              }
            ],
            sourceType: 'script',
            type: 'Program'
          }
  });

  pass(`for(;;
  ) {
    break;
  }`, Context.OptionsRanges | Context.OptionsLoc | Context.OptionsRaw, {
      source: `for(;;
      ) {
        break;
      }`,
      expected: {
        "type": "Program",
        "sourceType": "script",
        "body": [
            {
                "type": "ForStatement",
                "body": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "BreakStatement",
                            "label": null,
                            "start": 25,
                            "end": 31,
                            "loc": {
                                "start": {
                                    "line": 3,
                                    "column": 8
                                },
                                "end": {
                                    "line": 3,
                                    "column": 14
                                }
                            }
                        }
                    ],
                    "start": 15,
                    "end": 39,
                    "loc": {
                        "start": {
                            "line": 2,
                            "column": 8
                        },
                        "end": {
                            "line": 4,
                            "column": 7
                        }
                    }
                },
                "init": null,
                "test": null,
                "update": null,
                "start": 0,
                "end": 39,
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 4,
                        "column": 7
                    }
                }
            }
        ],
        "start": 0,
        "end": 39,
        "loc": {
            "start": {
                "line": 1,
                "column": 0
            },
            "end": {
                "line": 4,
                "column": 7
            }
        }
    }
  });

pass(`x: while(true) { continue x\n; }`, Context.Empty, {
      source: 'x: while(true) { continue x\n; }',
      expected: {
            body: [
              {
                body: {
                  body: {
                    body: [
                      {
                        label: {
                          name: 'x',
                          type: 'Identifier'
                        },
                        type: 'ContinueStatement'
                      }
                    ],
                    type: 'BlockStatement'
                  },
                  test: {
                    type: 'Literal',
                    value: true,
                  },
                  type: 'WhileStatement'
                },
                label: {
                  name: 'x',
                  type: 'Identifier'
                },
               type: 'LabeledStatement'
              }
            ],
            sourceType: 'script',
            type: 'Program'
          }
  });

  pass(`{1} 2`, Context.Empty, {
        source: '{1} 2',
        expected: {
              body: [
                {
                  body: [
                    {
                      expression: {
                        type: 'Literal',
                        value: 1,
                      },
                      type: 'ExpressionStatement'
                    }
                  ],
                  type: 'BlockStatement'
                },
                {
                  expression: {
                    type: 'Literal',
                    value: 2,
                  },
                 type: 'ExpressionStatement'
                }
              ],
              sourceType: 'script',
              type: 'Program'
            }
    });

      pass(`{1
        2} 3`, Context.Empty, {
        source: `{1
            2} 3`,
        expected: {
              body: [
                {
                  body: [
                    {
                      expression: {
                        type: 'Literal',
                        value: 1
                      },
                      type: 'ExpressionStatement'
                    },
                    {
                      expression: {
                        type: 'Literal',
                        value: 2
                      },
                      type: 'ExpressionStatement'
                    }
                  ],
                  type: 'BlockStatement'
                },
                {
                  expression: {
                    type: 'Literal',
                    value: 3,
                  },
                 type: 'ExpressionStatement'
                },
              ],
              sourceType: 'script',
             type: 'Program'
            }
    });

      pass(`while (true) { break // Comment
  there; }`, Context.OptionsLoc | Context.OptionsRaw, {
          source: `while (true) { break // Comment
      there; }`,
          expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "WhileStatement",
                    "test": {
                        "type": "Literal",
                        "value": true,
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 7
                            },
                            "end": {
                                "line": 1,
                                "column": 11
                            }
                        }
                    },
                    "body": {
                        "type": "BlockStatement",
                        "body": [
                            {
                                "type": "BreakStatement",
                                "label": null,
                                "loc": {
                                    "start": {
                                        "line": 1,
                                        "column": 15
                                    },
                                    "end": {
                                        "line": 1,
                                        "column": 20
                                    }
                                }
                            },
                            {
                                "type": "ExpressionStatement",
                                "expression": {
                                    "type": "Identifier",
                                    "name": "there",
                                    "loc": {
                                        "start": {
                                            "line": 2,
                                            "column": 6
                                        },
                                        "end": {
                                            "line": 2,
                                            "column": 11
                                        }
                                    }
                                },
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 6
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 12
                                    }
                                }
                            }
                        ],
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 13
                            },
                            "end": {
                                "line": 2,
                                "column": 14
                            }
                        }
                    },
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 0
                        },
                        "end": {
                            "line": 2,
                            "column": 14
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
                    "line": 2,
                    "column": 14
                }
            }
        }
      });
  });
});
