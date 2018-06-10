import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Expressions - Array', () => {

    
const validSyntax = [
    '[1 <= 0]',
    'let [a,,b] = c',
    '[a, ...b=c]',
    '([a, ...b=c])',
    '[,,1,,,2,3,,]',
    '[ 1, 2,, 3, ]',
    '[ 0 ]',
    '[ ,, 0 ]',
    ' [,,3,,,]',
    '[,]',
    '[x()]',
    '[a, ...b]',
    '[function* f() {}]',
    //'[a, ...{0: b}] = (1);',
    '[...{a}] = b;',
    '[...{a}] = b;',
    //'[a, ...{0: b}] = 1',
    '[1, "z", "a", "Symbol(foo)"]',
    '[{...null}]',
    '[{...{a: 2, b: 3}, ... {c: 4, d: 5}}]',
    '[1, 2, 3, ...[]]',
    ' [...{}];',
    '[1,2,,4,5];',
    'var array = [,,,,,];',
    'var a = [,];',
    'let a = [];',
    'let b = [42];',
    'let c = [42, 7];',
    'let [d, ...e] = [1, 2, 3, 4, 5];'
];

for (const arg of validSyntax) {

    it(`${arg}`, () => {
        t.doesNotThrow(() => {
            parseSource(`${arg}`, undefined, Context.Empty);
        });
    });

    it(`${arg}`, () => {
        t.doesNotThrow(() => {
            parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
        });
    });

    it(`"use strict"; ${arg}`, () => {
        t.doesNotThrow(() => {
            parseSource(`"use strict"; ${arg}`, undefined, Context.Empty);
        });
    });
}

    pass('[]', Context.Empty, {
        source: '[]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": []
                    }
                }
            ]
        }
    });  

    pass('[x]', Context.Empty, {
        source: '[x]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            {
                                "type": "Identifier",
                                "name": "x"
                            }
                        ]
                    }
                }
            ]
        }
    });  

    pass('[,]', Context.Empty, {
        source: '[,]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            null
                        ]
                    }
                }
            ]
        }
    });  

    pass('[,,]', Context.Empty, {
        source: '[,,]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            null,
                            null
                        ]
                    }
                }
            ]
        }
    });  

    pass('[,,,,,,,,,,,,,,,,,,,,,]', Context.Empty, {
        source: '[,,,,,,,,,,,,,,,,,,,,,]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null
                        ]
                    }
                }
            ]
        }
    });  

    pass('[,,a,,,,b,,,,,,,,c,,,,,,]', Context.Empty, {
        source: '[,,a,,,,b,,,,,,,,c,,,,,,]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            null,
                            null,
                            {
                                "type": "Identifier",
                                "name": "a"
                            },
                            null,
                            null,
                            null,
                            {
                                "type": "Identifier",
                                "name": "b"
                            },
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            {
                                "type": "Identifier",
                                "name": "c"
                            },
                            null,
                            null,
                            null,
                            null,
                            null
                        ]
                    }
                }
            ]
        }
    });  

    pass('[,,,,,,,,,,,,,,,,,,,,,,,,,fkleuver,,,,,,,,,,,,,,,,,,,,,,,,,,]', Context.Empty, {
        source: '[,,,,,,,,,,,,,,,,,,,,,,,,,fkleuver,,,,,,,,,,,,,,,,,,,,,,,,,,]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            {
                                "type": "Identifier",
                                "name": "fkleuver"
                            },
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null
                        ]
                    }
                }
            ]
        }
    });  

    pass('[,x]', Context.Empty, {
        source: '[,x]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            null,
                            {
                                "type": "Identifier",
                                "name": "x"
                            }
                        ]
                    }
                }
            ]
        }
    });  

    pass('[,,x]', Context.Empty, {
        source: '[,,x]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            null,
                            null,
                            {
                                "type": "Identifier",
                                "name": "x"
                            }
                        ]
                    }
                }
            ]
        }
    });  

    pass('[x,,y]', Context.Empty, {
        source: '[x,,y]',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "ArrayExpression",
                        "elements": [
                            {
                                "type": "Identifier",
                                "name": "x"
                            },
                            null,
                            {
                                "type": "Identifier",
                                "name": "y"
                            }
                        ]
                    }
                }
            ]
        }
    });  

    pass('[foo, [[[[[[[[[[[[[x,y,z]]]]]]]]]]]]], bar = B] = arr;', Context.Empty, {
        source: '[foo, [[[[[[[[[[[[[x,y,z]]]]]]]]]]]]], bar = B] = arr;',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "ArrayPattern",
                            "elements": [
                                {
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                {
                                    "type": "ArrayPattern",
                                    "elements": [
                                        {
                                            "type": "ArrayPattern",
                                            "elements": [
                                                {
                                                    "type": "ArrayPattern",
                                                    "elements": [
                                                        {
                                                            "type": "ArrayPattern",
                                                            "elements": [
                                                                {
                                                                    "type": "ArrayPattern",
                                                                    "elements": [
                                                                        {
                                                                            "type": "ArrayPattern",
                                                                            "elements": [
                                                                                {
                                                                                    "type": "ArrayPattern",
                                                                                    "elements": [
                                                                                        {
                                                                                            "type": "ArrayPattern",
                                                                                            "elements": [
                                                                                                {
                                                                                                    "type": "ArrayPattern",
                                                                                                    "elements": [
                                                                                                        {
                                                                                                            "type": "ArrayPattern",
                                                                                                            "elements": [
                                                                                                                {
                                                                                                                    "type": "ArrayPattern",
                                                                                                                    "elements": [
                                                                                                                        {
                                                                                                                            "type": "ArrayPattern",
                                                                                                                            "elements": [
                                                                                                                                {
                                                                                                                                    "type": "ArrayPattern",
                                                                                                                                    "elements": [
                                                                                                                                        {
                                                                                                                                            "type": "Identifier",
                                                                                                                                            "name": "x"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                            "type": "Identifier",
                                                                                                                                            "name": "y"
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                            "type": "Identifier",
                                                                                                                                            "name": "z"
                                                                                                                                        }
                                                                                                                                    ]
                                                                                                                                }
                                                                                                                            ]
                                                                                                                        }
                                                                                                                    ]
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "bar"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "B"
                                    }
                                }
                            ]
                        },
                        "operator": "=",
                        "right": {
                            "type": "Identifier",
                            "name": "arr"
                        }
                    }
                }
            ]
        }
    });

    pass('[foo, [x,y,z], bar = B] = arr;', Context.Empty, {
        source: '[foo, [x,y,z], bar = B] = arr;',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "ArrayPattern",
                            "elements": [
                                {
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                {
                                    "type": "ArrayPattern",
                                    "elements": [
                                        {
                                            "type": "Identifier",
                                            "name": "x"
                                        },
                                        {
                                            "type": "Identifier",
                                            "name": "y"
                                        },
                                        {
                                            "type": "Identifier",
                                            "name": "z"
                                        }
                                    ]
                                },
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "bar"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "B"
                                    }
                                }
                            ]
                        },
                        "operator": "=",
                        "right": {
                            "type": "Identifier",
                            "name": "arr"
                        }
                    }
                }
            ]
        }
    });

    pass('[foo = A, bar = B] = arr;', Context.Empty, {
        source: '[foo = A, bar = B] = arr;',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "ArrayPattern",
                            "elements": [
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "foo"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "A"
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
                                        "name": "B"
                                    }
                                }
                            ]
                        },
                        "operator": "=",
                        "right": {
                            "type": "Identifier",
                            "name": "arr"
                        }
                    }
                }
            ]
        }
    });  

    pass('[foo, [x,y = 20,z], bar = B] = arr;', Context.Empty, {
        source: '[foo, [x,y = 20,z], bar = B] = arr;',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "ArrayPattern",
                            "elements": [
                                {
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                {
                                    "type": "ArrayPattern",
                                    "elements": [
                                        {
                                            "type": "Identifier",
                                            "name": "x"
                                        },
                                        {
                                            "type": "AssignmentPattern",
                                            "left": {
                                                "type": "Identifier",
                                                "name": "y"
                                            },
                                            "right": {
                                                "type": "Literal",
                                                "value": 20
                                            }
                                        },
                                        {
                                            "type": "Identifier",
                                            "name": "z"
                                        }
                                    ]
                                },
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "bar"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "B"
                                    }
                                }
                            ]
                        },
                        "operator": "=",
                        "right": {
                            "type": "Identifier",
                            "name": "arr"
                        }
                    }
                }
            ]
        }
    });

    pass('foo([a, b] = arr);', Context.Empty, {
        source: 'foo([a, b] = arr);',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "Identifier",
                            "name": "foo"
                        },
                        "arguments": [
                            {
                                "type": "AssignmentExpression",
                                "left": {
                                    "type": "ArrayPattern",
                                    "elements": [
                                        {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        {
                                            "type": "Identifier",
                                            "name": "b"
                                        }
                                    ]
                                },
                                "operator": "=",
                                "right": {
                                    "type": "Identifier",
                                    "name": "arr"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    });

    pass('[a,b=[x,y]] = z', Context.Empty, {
        source: '[a,b=[x,y]] = z',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "ArrayPattern",
                            "elements": [
                                {
                                    "type": "Identifier",
                                    "name": "a"
                                },
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "b"
                                    },
                                    "right": {
                                        "type": "ArrayExpression",
                                        "elements": [
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
                                }
                            ]
                        },
                        "operator": "=",
                        "right": {
                            "type": "Identifier",
                            "name": "z"
                        }
                    }
                }
            ]
        }
    });

    pass('[a,b^=[x,y]] = z', Context.Empty, {
        source: '[a,b^=[x,y]] = z',
        expected: {
              "body": [
                {
                  "expression": {
                    "left": {
                      "elements": [
                        {
                          "name": "a",
                          "type": "Identifier",
                        },
                        {
                          "left": {
                            "name": "b",
                            "type": "Identifier",
                          },
                         "right": {
                            "elements": [
                              {
                                "name": "x",
                                "type": "Identifier",
                              },
                              {
                                "name": "y",
                                "type": "Identifier",
                             },
                            ],
                           "type": "ArrayExpression",
                          },
                          "type": "AssignmentPattern",
                        }
                      ],
                      "type": "ArrayPattern",
                    },
                    "operator": "=",
                    "right": {
                      "name": "z",
                      "type": "Identifier",
                    },
                    "type": "AssignmentExpression",
                  },
                  "type": "ExpressionStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program"
            }
    }, function(errMsg: string) {
        t.equal(errMsg, 'Only \'=\' operator can be used for specifying default value');
    });

    pass('[a,b+=[x,y]] = z', Context.Empty, {
        source: '[a,b+=[x,y]] = z',
        expected: {
              "body": [
               {
                  "expression": {
                    "left": {
                      "elements": [
                        {
                          "name": "a",
                          "type": "Identifier",
                        },
                        {
                          "left": {
                            "name": "b",
                            "type": "Identifier",
                          },
                          "right": {
                            "elements": [
                              {
                                "name": "x",
                                "type": "Identifier",
                             },
                              {
                                "name": "y",
                                "type": "Identifier",
                              },
                            ],
                            "type": "ArrayExpression",
                          },
                          "type": "AssignmentPattern",
                        },
                      ],
                      "type": "ArrayPattern",
                    },
                    "operator": "=",
                    "right": {
                      "name": "z",
                      "type": "Identifier",
                    },
                    "type": "AssignmentExpression",
                  },
                  "type": "ExpressionStatement"
                }
              ],
             "sourceType": "script",
              "type": "Program"
            }
    }, function(errMsg: string) {
        t.equal(errMsg, 'Only \'=\' operator can be used for specifying default value');
    });


    
});