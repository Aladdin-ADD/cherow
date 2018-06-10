import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Variable', () => {

       pass('var foo;', Context.Empty, {
            source: 'var foo;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": null,
                        "id": {
                            "type": "Identifier",
                            "name": "foo"
                        }
                    }]
                }]
            },
        });
        pass('var foo = bar;', Context.Empty, {
            source: 'var foo = bar;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "bar"
                        },
                        "id": {
                            "type": "Identifier",
                            "name": "foo"
                        }
                    }]
                }]
            }
        });
    
        pass('var foo = bar', Context.Empty, {
            source: 'var foo = bar',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "bar"
                        },
                        "id": {
                            "type": "Identifier",
                            "name": "foo"
                        }
                    }]
                }]
            }
        });

        pass('var [...foo] = obj;', Context.Empty, {
                source: 'var [...foo] = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ArrayPattern",
                                            "elements": [
                                                {
                                                    "type": "RestElement",
                                                    "argument": {
                                                        "type": "Identifier",
                                                        "name": "foo"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });
    
            pass('var [foo, ...bar] = obj;', Context.Empty, {
                source: 'var [foo, ...bar] = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ArrayPattern",
                                            "elements": [
                                                {
                                                    "type": "Identifier",
                                                    "name": "foo"
                                                },
                                                {
                                                    "type": "RestElement",
                                                    "argument": {
                                                        "type": "Identifier",
                                                        "name": "bar"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var foo = bar\nvar zoo;', Context.Empty, {
            source: 'var foo = bar\nvar zoo;',
            expected: {
                "body": [{
                        "declarations": [{
                            "id": {
                                "name": "foo",
                                "type": "Identifier",
                            },
                            "init": {
                                "name": "bar",
                                "type": "Identifier",
                            },
                            "type": "VariableDeclarator",
                        }, ],
                        "kind": "var",
                        "type": "VariableDeclaration",
                    },
                    {
                        "declarations": [{
                            "id": {
                                "name": "zoo",
                                "type": "Identifier",
                            },
                            "init": null,
                            "type": "VariableDeclarator",
                        }, ],
                        "kind": "var",
                        "type": "VariableDeclaration",
                    },
                ],
                "sourceType": "script",
                "type": "Program"
            }
        });
    
        pass('var foo = bar, zoo = boo;', Context.Empty, {
            source: 'var foo = bar, zoo = boo;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "bar"
                            },
                            "id": {
                                "type": "Identifier",
                                "name": "foo"
                            }
                        },
                        {
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "boo"
                            },
                            "id": {
                                "type": "Identifier",
                                "name": "zoo"
                            }
                        }
                    ]
                }]
            }
        });
    
        pass('var\nfoo', Context.Empty, {
            source: 'var\nfoo',
            expected: {
                "body": [{
                    "declarations": [{
                        "id": {
                            "name": "foo",
                            "type": "Identifier",
                        },
                        "init": null,
                        "type": "VariableDeclarator",
                    }, ],
                    "kind": "var",
                    "type": "VariableDeclaration",
                }, ],
                "sourceType": "script",
                "type": "Program"
            }
        });
    
        pass('var [] = x;', Context.Empty, {
            source: 'var [] = x;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": []
                        }
                    }]
                }]
            }
        });
    
        pass('var [,] = x;', Context.Empty, {
            source: 'var [,] = x;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [
                                null
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [,,] = x;', Context.Empty, {
            source: 'var [,,] = x;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [
                                null,
                                null
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo] = arr;;', Context.OptionsEditorMode, {
            source: 'var [foo] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                "type": "Identifier",
                                "name": "foo"
                            }]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo,] = arr;', Context.Empty, {
            source: 'var [foo,] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                "type": "Identifier",
                                "name": "foo"
                            }]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo,,] = arr;', Context.Empty, {
            source: 'var [foo,,] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                null
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [,foo] = arr;', Context.Empty, {
            source: 'var [,foo] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [
                                null,
                                {
                                    "type": "Identifier",
                                    "name": "foo"
                                }
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [,,foo] = arr;', Context.Empty, {
            source: 'var [,,foo] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [
                                null,
                                null,
                                {
                                    "type": "Identifier",
                                    "name": "foo"
                                }
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo,bar] = arr;', Context.Empty, {
            source: 'var [foo,bar] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "bar"
                                }
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo,,bar] = arr;', Context.Empty, {
            source: 'var [foo,,bar] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                null,
                                {
                                    "type": "Identifier",
                                    "name": "bar"
                                }
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo] = arr, [bar] = arr2;', Context.Empty, {
            source: 'var [foo] = arr, [bar] = arr2;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "arr"
                            },
                            "id": {
                                "type": "ArrayPattern",
                                "elements": [{
                                    "type": "Identifier",
                                    "name": "foo"
                                }]
                            }
                        },
                        {
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "arr2"
                            },
                            "id": {
                                "type": "ArrayPattern",
                                "elements": [{
                                    "type": "Identifier",
                                    "name": "bar"
                                }]
                            }
                        }
                    ]
                }]
            }
        });
    
        pass('var [foo] = arr, bar;', Context.Empty, {
            source: 'var [foo] = arr, bar;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "arr"
                            },
                            "id": {
                                "type": "ArrayPattern",
                                "elements": [{
                                    "type": "Identifier",
                                    "name": "foo"
                                }]
                            }
                        },
                        {
                            "type": "VariableDeclarator",
                            "init": null,
                            "id": {
                                "type": "Identifier",
                                "name": "bar"
                            }
                        }
                    ]
                }]
            }
        });
    
        pass('var [foo] = arr, bar = arr2', Context.Empty, {
            source: 'var [foo] = arr, bar = arr2',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "arr"
                            },
                            "id": {
                                "type": "ArrayPattern",
                                "elements": [{
                                    "type": "Identifier",
                                    "name": "foo"
                                }]
                            }
                        },
                        {
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "arr2"
                            },
                            "id": {
                                "type": "Identifier",
                                "name": "bar"
                            }
                        }
                    ]
                }]
            }
        });
    
        pass('var foo, [bar] = arr2;', Context.OptionsEditorMode, {
            source: 'var foo, [bar] = arr2;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                            "type": "VariableDeclarator",
                            "init": null,
                            "id": {
                                "type": "Identifier",
                                "name": "foo"
                            }
                        },
                        {
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "arr2"
                            },
                            "id": {
                                "type": "ArrayPattern",
                                "elements": [{
                                    "type": "Identifier",
                                    "name": "bar"
                                }]
                            }
                        }
                    ]
                }]
            }
        });
    
        pass('var foo = arr, [bar] = arr2;', Context.OptionsEditorMode, {
            source: 'var foo = arr, [bar] = arr2;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "arr"
                            },
                            "id": {
                                "type": "Identifier",
                                "name": "foo"
                            }
                        },
                        {
                            "type": "VariableDeclarator",
                            "init": {
                                "type": "Identifier",
                                "name": "arr2"
                            },
                            "id": {
                                "type": "ArrayPattern",
                                "elements": [{
                                    "type": "Identifier",
                                    "name": "bar"
                                }]
                            }
                        }
                    ]
                }]
            }
        });
    
        pass('var [foo=a] = arr;', Context.OptionsEditorMode, {
            source: 'var [foo=a] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                "type": "AssignmentPattern",
                                "left": {
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "a"
                                }
                            }]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo=a, bar] = arr;', Context.Empty, {
            source: 'var [foo=a, bar] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "foo"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "Identifier",
                                    "name": "bar"
                                }
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo, bar=b] = arr;', Context.Empty, {
            source: 'var [foo, bar=b] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "bar"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "b"
                                    }
                                }
                            ]
                        }
                    }]
                }]
            }
        });
    
        pass('var [foo=a, bar=b] = arr;', Context.Empty, {
            source: 'var [foo=a, bar=b] = arr;',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [{
                    "type": "VariableDeclaration",
                    "kind": "var",
                    "declarations": [{
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "Identifier",
                            "name": "arr"
                        },
                        "id": {
                            "type": "ArrayPattern",
                            "elements": [{
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "foo"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "bar"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "b"
                                    }
                                }
                            ]
                        }
                    }]
                }]
            }
        });
       
       pass('var [foo];', Context.OptionsEditorMode, {
        source: 'var [foo];',
        expected: {
                  "body": [
                    {
                      "declarations": [
                        {
                          "id": {
                            "elements": [
                              {
                                "name": "foo",
                                "type": "Identifier",
                              },
                            ],
                            "type": "ArrayPattern",
                          },
                          "init": null,
                          "type": "VariableDeclarator",
                        },
                      ],
                      "kind": "var",
                      "type": "VariableDeclaration",
                    },
                  ],
                  "sourceType": "script",
                  "type": "Program",
                }
    }, function(errMsg: string) {
        t.equal(errMsg, 'Missing initializer in destructuring declaration');
    });
        pass('var [foo = x];', Context.OptionsEditorMode, {
            source: 'var [foo = x];',
            expected: {
                "body": [{
                    "declarations": [{
                        "id": {
                            "elements": [{
                                "left": {
                                    "name": "foo",
                                    "type": "Identifier",
                                },
                                "right": {
                                    "name": "x",
                                    "type": "Identifier",
                                },
                                "type": "AssignmentPattern",
                            }, ],
                            "type": "ArrayPattern",
                        },
                        "init": null,
                        "type": "VariableDeclarator",
                    }, ],
                    "kind": "var",
                    "type": "VariableDeclaration",
                }, ],
                "sourceType": "script",
                "type": "Program",
            }
        }, function(errMsg: string) {
            t.equal(errMsg, 'Missing initializer in destructuring declaration');
        });

        pass('var [foo], bar;', Context.OptionsEditorMode, {
                source: 'var [foo], bar;',
                expected: {
                          "body": [
                            {
                              "declarations": [
                                {
                                  "id": {
                                    "elements": [
                                      {
                                        "name": "foo",
                                       "type": "Identifier",
                                      },
                                    ],
                                    "type": "ArrayPattern",
                                  },
                                  "init": null,
                                  "type": "VariableDeclarator"
                                },
                                {
                                 "id": {
                                    "name": "bar",
                                    "type": "Identifier",
                                  },
                                  "init": null,
                                  "type": "VariableDeclarator"
                                },
                              ],
                              "kind": "var",
                              "type": "VariableDeclaration"
                            },
                          ],
                          "sourceType": "script",
                          "type": "Program"
                        }
            }, function(errMsg: string) {
                t.equal(errMsg, 'Missing initializer in destructuring declaration');
            });

            pass('var foo, [bar];', Context.OptionsEditorMode, {
                source: 'var foo, [bar];',
                expected: {
                          "body": [
                           {
                              "declarations": [
                               {
                                  "id": {
                                    "name": "foo",
                                    "type": "Identifier"
                                  },
                                  "init": null,
                                  "type": "VariableDeclarator"
                                },
                                {
                                 "id": {
                                    "elements": [
                                      {
                                        "name": "bar",
                                        "type": "Identifier",
                                      },
                                    ],
                                    "type": "ArrayPattern",
                                  },
                                  "init": null,
                                 "type": "VariableDeclarator"
                                },
                              ],
                              "kind": "var",
                              "type": "VariableDeclaration",
                            },
                          ],
                          "sourceType": "script",
                          "type": "Program"
                        }
            }, function(errMsg: string) {
                t.equal(errMsg, 'Missing initializer in destructuring declaration');
            });
/*
            // Note: This AST is invalid - it only works in editor mode
            pass('var [foo:bar] = obj;', Context.Empty, {
                source: 'var [foo:bar] = obj;',
                expected: {
                          "body": [
                            {
                              "declarations": [
                                {
                                  "id": {
                                    "elements": [
                                      {
                                        "name": "foo",
                                        "type": "Identifier"
                                      },
                                     {
                                        "name": "bar",
                                        "type": "Identifier",
                                      },
                                    ],
                                    "type": "ArrayPattern",
                                 },
                                  "init": {
                                    "name": "obj",
                                   "type": "Identifier",
                                  },
                                  "type": "VariableDeclarator",
                                },
                              ],
                              "kind": "var",
                              "type": "VariableDeclaration",
                           },
                          ],
                          "sourceType": "script",
                          "type": "Program"
                        }
            }, function(errMsg: string) {
                t.equal(errMsg, 'Unexpected token :');
            });*/

            pass('var {x} = obj;', Context.OptionsEditorMode, {
                source: 'var {x} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x,} = obj;', Context.Empty, {
                source: 'var {x,} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x, y} = obj;', Context.Empty, {
                source: 'var {x, y} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x} = a, obj;', Context.Empty, {
                source: 'var {x} = a, obj;',
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
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "type": "VariableDeclarator",
                                        "init": null,
                                        "id": {
                                            "type": "Identifier",
                                            "name": "obj"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var x = a, {y} = obj;', Context.Empty, {
                source: 'var x = a, {y} = obj;',
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
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "id": {
                                            "type": "Identifier",
                                            "name": "x"
                                        }
                                    },
                                    {
                                        "type": "VariableDeclarator",
                                        "init": {
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });
            
            pass('var x, {y} = obj;', Context.Empty, {
                source: 'var x, {y} = obj;',
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
                                        "init": null,
                                        "id": {
                                            "type": "Identifier",
                                            "name": "x"
                                        }
                                    },
                                    {
                                        "type": "VariableDeclarator",
                                        "init": {
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x = y} = obj;', Context.Empty, {
                source: 'var {x = y} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "AssignmentPattern",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "x"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "y"
                                                        }
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x = y, z} = obj;', Context.Empty, {
                source: 'var {x = y, z} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "AssignmentPattern",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "x"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "y"
                                                        }
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "z"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "z"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x, y = z} = obj;', Context.Empty, {
                source: 'var {x, y = z} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "AssignmentPattern",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "y"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "z"
                                                        }
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x = y, z = a} = obj;', Context.Empty, {
                source: 'var {x = y, z = a} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "AssignmentPattern",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "x"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "y"
                                                        }
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "z"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "AssignmentPattern",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "z"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "a"
                                                        }
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x : y} = obj;', Context.Empty, {
                source: 'var {x : y} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x : y, z} = obj;', Context.Empty, {
                source: 'var {x : y, z} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "z"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "z"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x : y, z : a} = obj;', Context.Empty, {
                source: 'var {x : y, z : a} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "z"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "a"
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x : y = z} = obj;', Context.Empty, {
                source: 'var {x : y = z} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "AssignmentPattern",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "y"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "z"
                                                        }
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x : y, z, a : b = c} = obj;', Context.Empty, {
                source: 'var {x : y, z, a : b = c} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "z"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "z"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "a"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "AssignmentPattern",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "b"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "c"
                                                        }
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {[x]: y} = z;', Context.Empty, {
                source: 'var {[x]: y} = z;',
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
                                            "type": "Identifier",
                                            "name": "z"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": true,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {[x]: y = z} = a;', Context.Empty, {
                source: 'var {[x]: y = z} = a;',
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
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": true,
                                                    "value": {
                                                        "type": "AssignmentPattern",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "y"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "z"
                                                        }
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {a, [x]: y} = a;', Context.Empty, {
                source: 'var {a, [x]: y} = a;',
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
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "a"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "a"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                },
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": true,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": false
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x} = a, {y} = obj;', Context.Empty, {
                source: 'var {x} = a, {y} = obj;',
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
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "type": "VariableDeclarator",
                                        "init": {
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {x} = a, y = obj;', Context.Empty, {
                source: 'var {x} = a, y = obj;',
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
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": [
                                                {
                                                    "type": "Property",
                                                    "kind": "init",
                                                    "key": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "computed": false,
                                                    "value": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "method": false,
                                                    "shorthand": true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "type": "VariableDeclarator",
                                        "init": {
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "Identifier",
                                            "name": "y"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var {} = obj;', Context.Empty, {
                source: 'var {} = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ObjectPattern",
                                            "properties": []
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var [a=[...b], ...c] = obj;', Context.Empty, {
                source: 'var [a=[...b], ...c] = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ArrayPattern",
                                            "elements": [
                                                {
                                                    "type": "AssignmentPattern",
                                                    "left": {
                                                        "type": "Identifier",
                                                        "name": "a"
                                                    },
                                                    "right": {
                                                        "type": "ArrayExpression",
                                                        "elements": [
                                                            {
                                                                "type": "SpreadElement",
                                                                "argument": {
                                                                    "type": "Identifier",
                                                                    "name": "b"
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    "type": "RestElement",
                                                    "argument": {
                                                        "type": "Identifier",
                                                        "name": "c"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });

            pass('var [x, ...[foo, bar]] = obj;', Context.Empty, {
                source: 'var [x, ...[foo, bar]] = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ArrayPattern",
                                            "elements": [
                                                {
                                                    "type": "Identifier",
                                                    "name": "x"
                                                },
                                                {
                                                    "type": "RestElement",
                                                    "argument": {
                                                        "type": "ArrayPattern",
                                                        "elements": [
                                                            {
                                                                "type": "Identifier",
                                                                "name": "foo"
                                                            },
                                                            {
                                                                "type": "Identifier",
                                                                "name": "bar"
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });
            pass('var [...[foo, bar]] = obj;', Context.Empty, {
                source: 'var [...[foo, bar]] = obj;',
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
                                            "type": "Identifier",
                                            "name": "obj"
                                        },
                                        "id": {
                                            "type": "ArrayPattern",
                                            "elements": [
                                                {
                                                    "type": "RestElement",
                                                    "argument": {
                                                        "type": "ArrayPattern",
                                                        "elements": [
                                                            {
                                                                "type": "Identifier",
                                                                "name": "foo"
                                                            },
                                                            {
                                                                "type": "Identifier",
                                                                "name": "bar"
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
            });
    });