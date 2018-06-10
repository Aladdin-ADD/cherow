import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - For', () => {

       pass('var foo;', Context.Empty, {
            source: 'for (;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": null,
                        "test": null,
                        "update": null
                    }
                ]
            },
        });

        pass('for (;b;);', Context.Empty, {
            source: 'for (;b;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": null,
                        "test": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "update": null
                    }
                ]
            }
        });

        pass('for (;;c);', Context.Empty, {
            source: 'for (;;c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": null,
                        "test": null,
                        "update": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });

        pass('for (a;b;);', Context.Empty, {
            source: 'for (a;b;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "test": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "update": null
                    }
                ]
            }
        });


        pass('for (a;;c);', Context.Empty, {
            source: 'for (a;;c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "test": null,
                        "update": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });

        pass('for (;b;c);', Context.Empty, {
            source: 'for (;b;c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": null,
                        "test": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "update": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });

        pass('for (a;b;c);', Context.Empty, {
            source: 'for (a;b;c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "test": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "update": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });

        pass('for (a + b * c * d;b;c);', Context.Empty, {
            source: 'for (a + b * c * d;b;c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "Identifier",
                                "name": "a"
                            },
                            "right": {
                                "type": "BinaryExpression",
                                "left": {
                                    "type": "BinaryExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "b"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "c"
                                    },
                                    "operator": "*"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "d"
                                },
                                "operator": "*"
                            },
                            "operator": "+"
                        },
                        "test": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "update": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });

        pass('for (a * b + c * d;b;c);', Context.Empty, {
            source: 'for (a * b + c * d;b;c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "BinaryExpression",
                                "left": {
                                    "type": "Identifier",
                                    "name": "a"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "b"
                                },
                                "operator": "*"
                            },
                            "right": {
                                "type": "BinaryExpression",
                                "left": {
                                    "type": "Identifier",
                                    "name": "c"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "d"
                                },
                                "operator": "*"
                            },
                            "operator": "+"
                        },
                        "test": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "update": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });

        pass('for ((a * b + c) * d;b;c);', Context.Empty, {
            source: 'for ((a * b + c) * d;b;c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "BinaryExpression",
                                "left": {
                                    "type": "BinaryExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "a"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "b"
                                    },
                                    "operator": "*"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "c"
                                },
                                "operator": "+"
                            },
                            "right": {
                                "type": "Identifier",
                                "name": "d"
                            },
                            "operator": "*"
                        },
                        "test": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "update": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });

        pass('for (var a;;);', Context.Empty, {
            source: 'for (var a;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                }
                            ]
                        },
                        "test": null,
                        "update": null
                    }
                ]
            }
        });

        pass('for (var a,b,c;;);', Context.Empty, {
            source: 'for (var a,b,c;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "b"
                                    }
                                },
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "c"
                                    }
                                }
                            ]
                        },
                        "test": null,
                        "update": null
                    }
                ]
            }
        });

        pass('for (let a;;);', Context.Empty, {
            source: 'for (let a;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "VariableDeclaration",
                            "kind": "let",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                }
                            ]
                        },
                        "test": null,
                        "update": null
                    }
                ]
            }
        });

        pass('for (let a,b,c;;);', Context.Empty, {
            source: 'for (let a,b,c;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "VariableDeclaration",
                            "kind": "let",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "b"
                                    }
                                },
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "c"
                                    }
                                }
                            ]
                        },
                        "test": null,
                        "update": null
                    }
                ]
            }
        });

        pass('for (const a,b,c;;);', Context.Empty, {
            source: 'for (const a,b,c;;);',
            expected: {
                  "body": [
                    {
                     "body": {
                        "type": "EmptyStatement"
                      },
                      "init": {
                        "declarations": [
                          {
                           "id": {
                              "name": "a",
                             "type": "Identifier",
                            },
                            "init": null,
                            "type": "VariableDeclarator"
                          },
                          {
                            "id": {
                              "name": "b",
                              "type": "Identifier",
                            },
                            "init": null,
                            "type": "VariableDeclarator",
                          },
                          {
                            "id": {
                              "name": "c",
                             "type": "Identifier",
                            },
                            "init": null,
                            "type": "VariableDeclarator"
                          },
                        ],
                        "kind": "const",
                        "type": "VariableDeclaration",
                      },
                      "test": null,
                      "type": "ForStatement",
                     "update": null,
                    },
                  ],
                  "sourceType": "script",
                  "type": "Program"
                }
        });

        pass('for (var a=1;;);', Context.Empty, {
            source: 'for (var a=1;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "Literal",
                                        "value": 1
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                }
                            ]
                        },
                        "test": null,
                        "update": null
                    }
                ]
            }
        });

        pass('for (var a=1, b;;);', Context.Empty, {
            source: 'for (var a=1, b;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "Literal",
                                        "value": 1
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "b"
                                    }
                                }
                            ]
                        },
                        "test": null,
                        "update": null
                    }
                ]
            }
        });

        pass('for (var a, b=1;;);', Context.Empty, {
            source: 'for (var a, b=1;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": null,
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "Literal",
                                        "value": 1
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "b"
                                    }
                                }
                            ]
                        },
                        "test": null,
                        "update": null
                    }
                ]
            }
        });

        pass('for (var a=1, b=2;;);', Context.Empty, {
            source: 'for (var a=1, b=2;;);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "init": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "Literal",
                                        "value": 1
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "Literal",
                                        "value": 2
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "b"
                                    }
                                }
                            ]
                        },
                        "test": null,
                        "update": null
                    }
                ]
            }
        });
    });