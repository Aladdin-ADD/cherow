import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Break', () => {

    describe('Statements - Editor mode', () => {

        pass('break;', Context.OptionsEditorMode, {
            source: `break`,
            expected: {
                  "body": [
                   {
                      "label": null,
                      "type": "BreakStatement"
                    }
                  ],
                  "sourceType": "script",
                  "type": "Program"
                }
        },  (msg: string) => {
             t.equal(msg, 'Illegal break statement');
        });
 
     pass('while ( false ) Label: continue Label;', Context.OptionsEditorMode, {
        source: `while ( foo ) Label: break Label;`,
        expected: {
              "body": [
                {
                  "body": {
                    "body": {
                      "label": {
                        "name": "Label",
                        "type": "Identifier",
                      },
                      "type": "BreakStatement",
                    },
                    "label": {
                      "name": "Label",
                      "type": "Identifier",
                    },
                    "type": "LabeledStatement",
                  },
                  "test": {
                            "name": "foo",
                            "type": "Identifier",
                          },
                  "type": "WhileStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program"
            }
    },  () => {
        
    });

    pass('do {  test262: {  break test262; } } while (a)', Context.OptionsEditorMode, {
        source: `do {  test262: {  break test262; } } while (a)`,
        expected: {
              "body": [
               {
                  "body": {
                    "body": [
                      {
                        "body": {
                          "body": [
                            {
                              "label": {
                                "name": "test262",
                                "type": "Identifier",
                              },
                              "type": "BreakStatement",
                            },
                          ],
                          "type": "BlockStatement",
                        },
                        "label": {
                          "name": "test262",
                          "type": "Identifier",
                        },
                        "type": "LabeledStatement",
                      },
                    ],
                    "type": "BlockStatement",
                  },
                  "test": {
                    "name": "a",
                    "type": "Identifier",
                  },
                  "type": "DoWhileStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program"
            }
    },  (msg: string) => {
        t.equal(msg, "Undefined label 'test262'")
    });

    pass('do {  test262: {  break test262; } } while (a)', Context.OptionsEditorMode, {
        source: `do {  test262: {  break test262; } } while (a)`,
        expected: {
              "body": [
                {
                 "body": {
                    "body": [
                      {
                        "body": {
                          "body": [
                            {
                              "label": {
                                "name": "test262",
                                "type": "Identifier",
                              },
                              "type": "BreakStatement",
                            },
                          ],
                          "type": "BlockStatement",
                        },
                        "label": {
                          "name": "test262",
                          "type": "Identifier",
                       },
                        "type": "LabeledStatement",
                      }
                    ],
                    "type": "BlockStatement",
                  },
                  "test": {
                    "name": "a",
                    "type": "Identifier",
                 },
                  "type": "DoWhileStatement"
                }
              ],
              "sourceType": "script",
              "type": "Program"
            }
    },  (msg: string) => {
        t.equal(msg, "Undefined label 'test262'")
    });

    pass('ice: while(true) { break fapper; }', Context.OptionsEditorMode, {
        source: `ice: while(a) { break fapper; }`,
        expected: {
              "body": [
                {
                  "body": {
                    "body": {
                      "body": [
                        {
                         "label": {
                            "name": "fapper",
                            "type": "Identifier",
                          },
                          "type": "BreakStatement",
                        },
                      ],
                      "type": "BlockStatement",
                    },
                    "test": {
                                  "name": "a",
                                  "type": "Identifier",
                                },
                    "type": "WhileStatement",
                  },
                  "label": {
                    "name": "ice",
                    "type": "Identifier",
                  },
                  "type": "LabeledStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program"
            }
    },  (msg: string) => {
        t.equal(msg, 'Undefined label \'fapper\'')
    });

    pass('loop1: while (a) { loop2: function a() { break loop2; } }', Context.OptionsEditorMode, {
        source: `loop1: while (a) { loop2: function a() { break loop2; } }`,
        expected: {
              "body": [
                {
                  "body": {
                    "body": {
                      "body": [
                        {
                          "body": {
                            "async": false,
                            "body": {
                              "body": [
                                {
                                  "label": {
                                   "name": "loop2",
                                    "type": "Identifier",
                                  },
                                  "type": "BreakStatement",
                                },
                              ],
                              "type": "BlockStatement",
                            },
                            "expression": false,
                            "generator": false,
                            "id": {
                              "name": "a",
                              "type": "Identifier",
                            },
                            "params": [],
                            "type": "FunctionDeclaration",
                          },
                          "label": {
                            "name": "loop2",
                           "type": "Identifier",
                          },
                          "type": "LabeledStatement",
                        }
                      ],
                      "type": "BlockStatement",
                    },
                    "test": {
                      "name": "a",
                      "type": "Identifier",
                    },
                    "type": "WhileStatement",
                  },
                  "label": {
                    "name": "loop1",
                   "type": "Identifier",
                  },
                  "type": "LabeledStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program",
            }
    },  (msg: string) => {
        t.equal(msg, 'Undefined label \'loop2\'')
    });

    pass('loop1: while (a) { loop1: function a() { break loop1; } }', Context.OptionsEditorMode, {
        source: `loop1: while (a) { loop1: function a() { break loop1; } }`,
        expected: {
              "body": [
                {
                  "body": {
                    "body": {
                      "body": [
                        {
                          "body": {
                            "async": false,
                            "body": {
                              "body": [
                                {
                                  "label": {
                                    "name": "loop1",
                                    "type": "Identifier",
                                  },
                                 "type": "BreakStatement",
                                },
                              ],
                              "type": "BlockStatement",
                            },
                            "expression": false,
                            "generator": false,
                            "id": {
                             "name": "a",
                              "type": "Identifier",
                            },
                            "params": [],
                            "type": "FunctionDeclaration",
                          },
                         "label": {
                            "name": "loop1",
                            "type": "Identifier",
                          },
                          "type": "LabeledStatement",
                        },
                      ],
                      "type": "BlockStatement",
                    },
                    "test": {
                      "name": "a",
                      "type": "Identifier",
                    },
                    "type": "WhileStatement",
                  },
                  "label": {
                    "name": "loop1",
                    "type": "Identifier",
                  },
                  "type": "LabeledStatement",
                }
              ],
              "sourceType": "script",
              "type": "Program"
            }
    },  () => {
//        t.equal(msg, 'Label \'loop1\' has already been declared')
    });

    pass('try{ LABEL1 : do { throw foo;  } while(0); } catch(e){ break LABEL2; LABEL2 : do {} while(0); };', Context.OptionsEditorMode, {
        source: `try{ LABEL1 : do { throw foo;  } while(0); } catch(e){ break LABEL2; LABEL2 : do {} while(0); };`,
        expected: {
              "body": [
                {
                  "block": {
                    "body": [
                      {
                        "body": {
                          "body": {
                            "body": [
                              {
                               "argument": {
                                  "name": "foo",
                                  "type": "Identifier",
                                },
                                "type": "ThrowStatement",
                              },
                           ],
                            "type": "BlockStatement",
                          },
                          "test": {
                            "type": "Literal",
                            "value": 0,
                          },
                          "type": "DoWhileStatement",
                        },
                        "label": {
                          "name": "LABEL1",
                          "type": "Identifier",
                        },
                        "type": "LabeledStatement",
                      },
                    ],
                    "type": "BlockStatement",
                  },
                  "finalizer": null,
                  "handler": {
                    "body": {
                      "body": [
                        {
                          "label": {
                            "name": "LABEL2",
                            "type": "Identifier",
                          },
                          "type": "BreakStatement",
                       },
                        {
                          "body": {
                            "body": {
                              "body": [],
                             "type": "BlockStatement",
                            },
                            "test": {
                              "type": "Literal",
                              "value": 0,
                           },
                            "type": "DoWhileStatement",
                          },
                          "label": {
                            "name": "LABEL2",
                            "type": "Identifier",
                          },
                          "type": "LabeledStatement",
                        },
                      ],
                      "type": "BlockStatement",
                    },
                    "param": {
                      "name": "e",
                      "type": "Identifier",
                    },
                    "type": "CatchClause"
                  },
                  "type": "TryStatement"
                },
                {
                  "type": "EmptyStatement"
                }
              ],
              "sourceType": "script",
              "type": "Program"
            }
    },  (msg: string) => {
        t.equal(msg, 'Undefined label \'LABEL2\'')
    });

});
    describe('Statements - Editor mode', () => {
        pass('while (foo) { break; }', Context.OptionsEditorMode, {
            source: 'while (foo) { break; }',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "WhileStatement",
                        "test": {
                            "type": "Identifier",
                            "name": "foo"
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "BreakStatement",
                                    "label": null
                                }
                            ]
                        }
                    }
                ]
            }
        }); 

        pass('while (foo) { break; }', Context.Empty, {
            source: 'while (foo) { break; }',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "WhileStatement",
                        "test": {
                            "type": "Identifier",
                            "name": "foo"
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "BreakStatement",
                                    "label": null
                                }
                            ]
                        }
                    }
                ]
            }
        }); 

        pass(`var count = 0;
        label: for (let x = 0; x < 10;) {
          while (a) {
            x++;
            count++;
            break label;
          }
        }`, Context.Empty, {
            source: `var count = 0;
            label: for (let x = 0; x < 10;) {
              while (a) {
                x++;
                count++;
                break label;
              }
            }`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "VariableDeclaration",
                        "kind": "var",
                        "declarations": [
                            {
                                "type": "VariableDeclarator",
                                "init": {
                                    "type": "Literal",
                                    "value": 0
                                },
                                "id": {
                                    "type": "Identifier",
                                    "name": "count"
                                }
                            }
                        ]
                    },
                    {
                        "type": "LabeledStatement",
                        "label": {
                            "type": "Identifier",
                            "name": "label"
                        },
                        "body": {
                            "type": "ForStatement",
                            "body": {
                                "type": "BlockStatement",
                                "body": [
                                    {
                                        "type": "WhileStatement",
                                        "test": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "body": {
                                            "type": "BlockStatement",
                                            "body": [
                                                {
                                                    "type": "ExpressionStatement",
                                                    "expression": {
                                                        "type": "UpdateExpression",
                                                        "argument": {
                                                            "type": "Identifier",
                                                            "name": "x"
                                                        },
                                                        "operator": "++",
                                                        "prefix": false
                                                    }
                                                },
                                                {
                                                    "type": "ExpressionStatement",
                                                    "expression": {
                                                        "type": "UpdateExpression",
                                                        "argument": {
                                                            "type": "Identifier",
                                                            "name": "count"
                                                        },
                                                        "operator": "++",
                                                        "prefix": false
                                                    }
                                                },
                                                {
                                                    "type": "BreakStatement",
                                                    "label": {
                                                        "type": "Identifier",
                                                        "name": "label"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "init": {
                                "type": "VariableDeclaration",
                                "kind": "let",
                                "declarations": [
                                    {
                                        "type": "VariableDeclarator",
                                        "init": {
                                            "type": "Literal",
                                            "value": 0
                                        },
                                        "id": {
                                            "type": "Identifier",
                                            "name": "x"
                                        }
                                    }
                                ]
                            },
                            "test": {
                                "type": "BinaryExpression",
                                "left": {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 10
                                },
                                "operator": "<"
                            },
                            "update": null
                        }
                    }
                ]
            }
        }); 
    });
});