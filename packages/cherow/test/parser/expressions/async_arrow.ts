import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Async arrow', () => {

    describe('Pass', () => {

        pass('async () => { await import(x) }', Context.OptionsNext, {
            source: `async () => { await import(x) }`,
            expected: {
                  "body": [
                    {
                      "expression": {
                        "async": true,
                        "body": {
                          "body": [
                            {
                              "expression": {
                                "argument": {
                                  "arguments": [
                                    {
                                     "name": "x",
                                      "type": "Identifier",
                                    },
                                  ],
                                  "callee": {
                                    "type": "Import",
                                 },
                                  "type": "CallExpression",
                                },
                                "type": "AwaitExpression",
                              },
                              "type": "ExpressionStatement",
                            },
                          ],
                          "type": "BlockStatement",
                        },
                        "expression": false,
                        "generator": false,
                        "id": null,
                        "params": [],
                       "type": "ArrowFunctionExpression",
                      },
                      "type": "ExpressionStatement",
                    },
                  ],
                  "sourceType": "script",
                  "type": "Program",
                }
        });

        pass('async (x)=>x;', Context.Empty, {
            source: `async (x)=>x;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            }
        });

        pass('async (x)=>{x}', Context.Empty, {
            source: `async (x)=>{x}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "BlockStatement",
                                "body": [
                                    {
                                        "type": "ExpressionStatement",
                                        "expression": {
                                            "type": "Identifier",
                                            "name": "x"
                                        }
                                    }
                                ]
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": false
                        }
                    }
                ]
            }
        });

        pass('async (a = 1, b = 2) => x;', Context.Empty, {
            source: `async (a = 1, b = 2) => x;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "a"
                                    },
                                    "right": {
                                        "type": "Literal",
                                        "value": 1
                                    }
                                },
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "b"
                                    },
                                    "right": {
                                        "type": "Literal",
                                        "value": 2
                                    }
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            }
        });

        pass('async ariya => x;', Context.Empty, {
            source: `async ariya => x;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "ariya"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            }
        });

        pass(`
        async (x, y)=>x;
        async (x, y)=>x;
        async(x, y);
        (x, y)=>x;
        async (x, y)=>x;
        async x => x;
        async x => {};
        x => y;
        async (x, y)=>x;
        (x, y)=>x;
        async (x, y)=>x;
        async (x, y)=>x;
        (x, y)=>x;
        async (x, y)=>x;
        async (x, y)=>x;
        (x, y)=>x;
        async (x, y)=>x;
        async (x, y)=>x;`, Context.Empty, {
            source: `
            async (x, y)=>x;
            async (x, y)=>x;
            async(x, y);
            (x, y)=>x;
            async (x, y)=>x;
            async x => x;
            async x => {};
            x => y;
            async (x, y)=>x;
            (x, y)=>x;
            (x, y)=>x;
            async (x, y)=>x;
            async (x, y)=>x;
            (x, y)=>x;
            async (x, y)=>x;
            async (x, y)=>x;
            (x, y)=>x;
            async (x, y)=>x;
            async (x, y)=>x;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Identifier",
                                "name": "async"
                            },
                            "arguments": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ]
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "BlockStatement",
                                "body": []
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": false
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "y"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            ],
                            "id": null,
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            }
        });

        pass('async (x, y)=>x;', Context.Empty, {
            source: `async (x, y)=>x;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "params": [
                                {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            ],
                            "id": null,
                            "async": true,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            }
        });
    });
});