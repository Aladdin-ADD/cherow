import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - For In', () => {

    describe('Statements - Pass', () => {

      pass('for (a in b);', Context.Empty, {
            source: 'for (a in b);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                ]
            }
        });

        pass('for (var a in b);', Context.Empty, {
            source: 'for (var a in b);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
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
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                ]
            }
        });

        pass('for (let a in b);', Context.Empty, {
            source: 'for (let a in b);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
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
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                ]
            }
        });

        pass('for (const a in b);', Context.Empty, {
            source: 'for (const a in b);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
                            "type": "VariableDeclaration",
                            "kind": "const",
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
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        }
                    }
                ]
            }
        });

        pass('for (var a = b in c);', Context.Empty, {
            source: 'for (var a = b in c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "Identifier",
                                        "name": "b"
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                }
                            ]
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });

        pass('for (var a = ++b in c);', Context.Empty, {
            source: 'for (var a = ++b in c);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "UpdateExpression",
                                        "argument": {
                                            "type": "Identifier",
                                            "name": "b"
                                        },
                                        "operator": "++",
                                        "prefix": true
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                }
                            ]
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "c"
                        }
                    }
                ]
            }
        });
/*
        pass('for (var a = 0 in stored = a, {});', Context.Empty, {
            source: 'for (var a = 0 in stored = a, {});',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
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
                                        "name": "a"
                                    }
                                }
                            ]
                        },
                        "right": {
                            "type": "SequenceExpression",
                            "expressions": [
                                {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "stored"
                                    },
                                    "operator": "=",
                                    "right": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "ObjectExpression",
                                    "properties": []
                                }
                            ]
                        }
                    }
                ]
            }
        });*/

        pass('for (var a = (++effects, -1) in x);', Context.Empty, {
            source: 'for (var a = (++effects, -1) in x);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "SequenceExpression",
                                        "expressions": [
                                            {
                                                "type": "UpdateExpression",
                                                "argument": {
                                                    "type": "Identifier",
                                                    "name": "effects"
                                                },
                                                "operator": "++",
                                                "prefix": true
                                            },
                                            {
                                                "type": "UnaryExpression",
                                                "operator": "-",
                                                "argument": {
                                                    "type": "Literal",
                                                    "value": 1
                                                },
                                                "prefix": true
                                            }
                                        ]
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                }
                            ]
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "x"
                        }
                    }
                ]
            }
        });
/*
        pass('for (var a in stored = a, {a: 0, b: 1, c: 2});', Context.Empty, {
            source: 'for (var a in stored = a, {a: 0, b: 1, c: 2});',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
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
                        "right": {
                            "type": "SequenceExpression",
                            "expressions": [
                                {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "stored"
                                    },
                                    "operator": "=",
                                    "right": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "a"
                                            },
                                            "value": {
                                                "type": "Literal",
                                                "value": 0
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        },
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "b"
                                            },
                                            "value": {
                                                "type": "Literal",
                                                "value": 1
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        },
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "c"
                                            },
                                            "value": {
                                                "type": "Literal",
                                                "value": 2
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        });*/
/*
        pass('for (var a = (++effects, -1) in stored = a, {a: 0, b: 1, c: 2});', Context.Empty, {
            source: 'for (var a = (++effects, -1) in stored = a, {a: 0, b: 1, c: 2});',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForInStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "SequenceExpression",
                                        "expressions": [
                                            {
                                                "type": "UpdateExpression",
                                                "argument": {
                                                    "type": "Identifier",
                                                    "name": "effects"
                                                },
                                                "operator": "++",
                                                "prefix": true
                                            },
                                            {
                                                "type": "UnaryExpression",
                                                "operator": "-",
                                                "argument": {
                                                    "type": "Literal",
                                                    "value": 1
                                                },
                                                "prefix": true
                                            }
                                        ]
                                    },
                                    "id": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                }
                            ]
                        },
                        "right": {
                            "type": "SequenceExpression",
                            "expressions": [
                                {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "stored"
                                    },
                                    "operator": "=",
                                    "right": {
                                        "type": "Identifier",
                                        "name": "a"
                                    }
                                },
                                {
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "a"
                                            },
                                            "value": {
                                                "type": "Literal",
                                                "value": 0
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        },
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "b"
                                            },
                                            "value": {
                                                "type": "Literal",
                                                "value": 1
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        },
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "c"
                                            },
                                            "value": {
                                                "type": "Literal",
                                                "value": 2
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        });*/
/*
        pass('for (a in b);', Context.Empty, {
            source: 'for (a in b);',
            expected: {}
        });

        pass('for (a in b);', Context.Empty, {
            source: 'for (a in b);',
            expected: {}
        });*/

    });
});