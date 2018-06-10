import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Continue', () => {

    describe('Statements - Editor mode', () => {

      pass('continue;', Context.OptionsEditorMode, {
        source: `continue`,
        expected: {
              "body": [
               {
                  "label": null,
                  "type": "ContinueStatement"
                }
              ],
              "sourceType": "script",
              "type": "Program"
            }
    },  (msg: string) => {
         t.equal(msg, 'Illegal continue statement: no surrounding iteration statement');
    });

      pass('while ( false ) Label: continue Label;', Context.OptionsEditorMode, {
        source: `while ( foo ) Label: continue Label;`,
        expected: {
              "body": [
                {
                  "body": {
                    "body": {
                      "label": {
                        "name": "Label",
                        "type": "Identifier",
                      },
                      "type": "ContinueStatement",
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
  
      pass('while ( false ) Label: continue Label;', Context.OptionsEditorMode, {
        source: `while ( foo ) Label: continue Label;`,
        expected: {
              "body": [
                {
                  "body": {
                    "body": {
                      "label": {
                        "name": "Label",
                        "type": "Identifier",
                      },
                      "type": "ContinueStatement",
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

    pass('do {  test262: {  continue test262; } } while (a)', Context.OptionsEditorMode, {
        source: `do {  test262: {  continue test262; } } while (a)`,
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
                              "type": "ContinueStatement",
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

    pass('do {  test262: {  continue test262; } } while (a)', Context.OptionsEditorMode, {
        source: `do {  test262: {  continue test262; } } while (a)`,
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
                              "type": "ContinueStatement",
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

    pass('ice: while(true) { continue fapper; }', Context.OptionsEditorMode, {
        source: `ice: while(a) { continue fapper; }`,
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
                          "type": "ContinueStatement",
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

    pass('loop1: while (true) { loop2: function a() { continue loop2; } }', Context.OptionsEditorMode, {
        source: `loop1: while (a) { loop2: function a() { continue loop2; } }`,
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
                                  "type": "ContinueStatement",
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

    pass('loop1: while (a) { loop1: function a() { continue loop1; } }', Context.OptionsEditorMode, {
        source: `loop1: while (a) { loop1: function a() { continue loop1; } }`,
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
                                 "type": "ContinueStatement",
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

    pass('try{ LABEL1 : do { throw foo;  } while(0); } catch(e){ continue LABEL2; LABEL2 : do {} while(0); };', Context.OptionsEditorMode, {
        source: `try{ LABEL1 : do { throw foo;  } while(0); } catch(e){ continue LABEL2; LABEL2 : do {} while(0); };`,
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
                          "type": "ContinueStatement",
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
        pass('while (foo) { continue; }', Context.OptionsEditorMode, {
            source: 'while (foo) { continue; }',
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
                                    "type": "ContinueStatement",
                                    "label": null
                                }
                            ]
                        }
                    }
                ]
            }
        }); 

        pass('while (foo) { continue; }', Context.OptionsEditorMode, {
            source: 'while (foo) { continue; }',
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
                                    "type": "ContinueStatement",
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
            continue label;
          }
        }`, Context.Empty, {
            source: `var count = 0;
            label: for (let x = 0; x < 10;) {
              while (a) {
                x++;
                count++;
                continue label;
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
                                                    "type": "ContinueStatement",
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