import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Assign', () => {

    pass('a *= b', Context.Empty, {
        source: 'a *= b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "*=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a /= b', Context.Empty, {
        source: 'a /= b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "/=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a %= b', Context.Empty, {
        source: 'a %= b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "%=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a += b', Context.Empty, {
        source: 'a += b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "+=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a <<= b', Context.Empty, {
        source: 'a <<= b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "<<=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a >>= b', Context.Empty, {
        source: 'a >>= b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": ">>=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a >>>= b', Context.Empty, {
        source: 'a >>>= b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": ">>>=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a &= b', Context.Empty, {
        source: 'a &= b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "&=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a ^= b', Context.Empty, {
        source: 'a ^= b',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "^=",
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                }
            ]
        }
    });  

    pass('a = b = c', Context.Empty, {
        source: 'a = b = c',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "=",
                        "right": {
                            "type": "AssignmentExpression",
                            "left": {
                                "type": "Identifier",
                                "name": "b"
                            },
                            "operator": "=",
                            "right": {
                                "type": "Identifier",
                                "name": "c"
                            }
                        }
                    }
                }
            ]
        }
    });  

    pass('a = b = c = d', Context.Empty, {
        source: 'a = b = c = d',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "operator": "=",
                        "right": {
                            "type": "AssignmentExpression",
                            "left": {
                                "type": "Identifier",
                                "name": "b"
                            },
                            "operator": "=",
                            "right": {
                                "type": "AssignmentExpression",
                                "left": {
                                    "type": "Identifier",
                                    "name": "c"
                                },
                                "operator": "=",
                                "right": {
                                    "type": "Identifier",
                                    "name": "d"
                                }
                            }
                        }
                    }
                }
            ]
        }
    });

    pass('a = b + c = d', Context.Empty, {
        source: 'a = b + c = d',
        expected: {
              "body": [
                {
                 "expression": {
                    "left": {
                      "name": "a",
                      "type": "Identifier",
                    },
                    "operator": "=",
                    "right": {
                      "left": {
                        "left": {
                          "name": "b",
                          "type": "Identifier",
                        },
                       "operator": "+",
                        "right": {
                          "name": "c",
                          "type": "Identifier",
                        },
                        "type": "BinaryExpression",
                      },
                      "operator": "=",
                      "right": {
                        "name": "d",
                        "type": "Identifier",
                      },
                      "type": "AssignmentExpression",
                    },
                    "type": "AssignmentExpression",
                 },
                  "type": "ExpressionStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program",
            }
    }, function(errMsg: string) {
        t.equal(errMsg, 'Only \'=\' operator can be used for specifying default value');
    });

    
});