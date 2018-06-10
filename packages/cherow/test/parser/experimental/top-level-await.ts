import * as t from 'assert';
import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Experimental - Top Level Await', () => {

    fail('function a() { return await 1 }', Context.Empty, {
        source: 'function a() { return await 1 }',
    });

   /* fail('function a() { return await 1 }', Context.OptionsExperimental, {
        source: 'function a() { return await 1 }',
    });*/

     // Should pass and not fail in editor mode
      pass('function a() { return await 1 }', Context.OptionsExperimental | Context.OptionsEditorMode, {
        source: 'function a() { return await 1 }',
        expected: {
              "body": [
                {
                  "async": false,
                  "body": {
                    "body": [
                      {
                        "argument": {
                          "argument": {
                            "type": "Literal",
                            "value": 1,
                          },
                          "type": "AwaitExpression",
                        },
                        "type": "ReturnStatement",
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
              ],
              "sourceType": "script",
              "type": "Program"
            }
    });

    pass('await 1', Context.OptionsExperimental, {
        source: 'await 1',
        expected: {
              "body": [
               {
                  "expression": {
                   "argument": {
                      "type": "Literal",
                      "value": 1,
                    },
                    "type": "AwaitExpression",
                  },
                  "type": "ExpressionStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program"
            }
    });

    pass('const strings = await import("foo");', Context.OptionsExperimental, {
        source: 'const strings = await import("foo");',
        expected: {
              "body": [
                {
                  "declarations": [
                    {
                      "id": {
                        "name": "strings",
                        "type": "Identifier",
                      },
                      "init": {
                        "argument": {
                          "arguments": [
                            {
                              "type": "Literal",
                              "value": "foo",
                            },
                          ],
                          "callee": {
                            "type": "Import",
                          },
                          "type": "CallExpression",
                        },
                        "type": "AwaitExpression",
                      },
                      "type": "VariableDeclarator",
                    },
                  ],
                  "kind": "const",
                  "type": "VariableDeclaration",
                }
              ],
              "sourceType": "script",
              "type": "Program"
            }
    });

    // import acorn and esprima from CDN
    pass(`try {
        acorn = await import('https://cdn-a.com/acorn');
      } catch {
        exprima = await import('https://cdn-b.com/exprima');
      }`, Context.OptionsExperimental | Context.OptionsNext, {
        source: `try {
            acorn = await import('https://cdn-a.com/acorn');
          } catch {
            exprima = await import('https://cdn-b.com/exprima');
          }`,
        expected: {
              "body": [
                {
                  "block": {
                    "body": [
                      {
                        "expression": {
                          "left": {
                          "name": "acorn",
                            "type": "Identifier",
                          },
                          "operator": "=",
                          "right": {
                            "argument": {
                             "arguments": [
                                {
                                  "type": "Literal",
                                  "value": "https://cdn-a.com/acorn",
                                },
                              ],
                             "callee": {
                                "type": "Import",
                              },
                              "type": "CallExpression",
                            },
                            "type": "AwaitExpression",
                         },
                          "type": "AssignmentExpression",
                        },
                        "type": "ExpressionStatement",
                      },
                    ],
                    "type": "BlockStatement",
                  },
                  "finalizer": null,
                 "handler": {
                    "body": {
                      "body": [
                        {
                          "expression": {
                            "left": {
                              "name": "exprima",
                              "type": "Identifier",
                            },
                            "operator": "=",
                            "right": {
                              "argument": {
                                "arguments": [
                                  {
                                    "type": "Literal",
                                    "value": "https://cdn-b.com/exprima",
                                  },
                                ],
                                "callee": {
                                  "type": "Import",
                                },
                                "type": "CallExpression",
                              },
                              "type": "AwaitExpression",
                            },
                            "type": "AssignmentExpression",
                          },
                          "type": "ExpressionStatement",
                        },
                      ],
                      "type": "BlockStatement",
                    },
                    "param": null,
                    "type": "CatchClause"
                 },
                  "type": "TryStatement"
                }
              ],
              "sourceType": "script",
              "type": "Program"
            }
    }); 
});