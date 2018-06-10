import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Group', () => {

    describe('Pass', () => {

        pass('(a = 1, b = 2);', Context.Empty, {
            source: `(a = 1, b = 2);`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "SequenceExpression",
                            "expressions": [
                                {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "a"
                                    },
                                    "operator": "=",
                                    "right": {
                                        "type": "Literal",
                                        "value": 1
                                    }
                                },
                                {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "b"
                                    },
                                    "operator": "=",
                                    "right": {
                                        "type": "Literal",
                                        "value": 2
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('((x));', Context.Empty, {
            source: `((x));`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "Identifier",
                            "name": "x"
                        }
                    }
                ]
            }
        });

        pass('(a) = 1;', Context.Empty, {
            source: `(a) = 1;`,
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
                                "type": "Literal",
                                "value": 1
                            }
                        }
                    }
                ]
            }
        });

        pass('(a.b) = 1;', Context.Empty, {
            source: `(a.b) = 1;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "left": {
                                "type": "MemberExpression",
                                "object": {
                                    "type": "Identifier",
                                    "name": "a"
                                },
                                "computed": false,
                                "property": {
                                    "type": "Identifier",
                                    "name": "b"
                                }
                            },
                            "operator": "=",
                            "right": {
                                "type": "Literal",
                                "value": 1
                            }
                        }
                    }
                ]
            }
        });

        pass('(a.b().c().d) = 1;', Context.Empty, {
            source: `(a.b().c().d) = 1;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "left": {
                                "type": "MemberExpression",
                                "object": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "MemberExpression",
                                        "object": {
                                            "type": "CallExpression",
                                            "callee": {
                                                "type": "MemberExpression",
                                                "object": {
                                                    "type": "Identifier",
                                                    "name": "a"
                                                },
                                                "computed": false,
                                                "property": {
                                                    "type": "Identifier",
                                                    "name": "b"
                                                }
                                            },
                                            "arguments": []
                                        },
                                        "computed": false,
                                        "property": {
                                            "type": "Identifier",
                                            "name": "c"
                                        }
                                    },
                                    "arguments": []
                                },
                                "computed": false,
                                "property": {
                                    "type": "Identifier",
                                    "name": "d"
                                }
                            },
                            "operator": "=",
                            "right": {
                                "type": "Literal",
                                "value": 1
                            }
                        }
                    }
                ]
            }
        });

        pass('(this[b]) = 1;', Context.Empty, {
            source: `(this[b]) = 1;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "left": {
                                "type": "MemberExpression",
                                "object": {
                                    "type": "ThisExpression"
                                },
                                "computed": true,
                                "property": {
                                    "type": "Identifier",
                                    "name": "b"
                                }
                            },
                            "operator": "=",
                            "right": {
                                "type": "Literal",
                                "value": 1
                            }
                        }
                    }
                ]
            }
        });

        pass('(a[b]) = 1;', Context.Empty, {
            source: `(a[b]) = 1;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "left": {
                                "type": "MemberExpression",
                                "object": {
                                    "type": "Identifier",
                                    "name": "a"
                                },
                                "computed": true,
                                "property": {
                                    "type": "Identifier",
                                    "name": "b"
                                }
                            },
                            "operator": "=",
                            "right": {
                                "type": "Literal",
                                "value": 1
                            }
                        }
                    }
                ]
            }
        });

        pass('((((((((((x))))))))));', Context.Empty, {
            source: `((((((((((x))))))))));`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "Identifier",
                            "name": "x"
                        }
                    }
                ]
            }
        });
    });
});