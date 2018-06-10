import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Arrow', () => {

    describe('Pass', () => {

        pass('(x)=>x;', Context.Empty, {
            source: `(x)=>x;`,
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
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            }
        });

        pass('(x)=>{x}', Context.Empty, {
            source: `(x)=>{x}`,
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
                            "async": false,
                            "generator": false,
                            "expression": false
                        }
                    }
                ]
            }
        });

        pass('(a = 1, b = 2) => x;', Context.Empty, {
            source: `(a = 1, b = 2) => x;`,
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
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            }
        });

        pass('var a = (b) => c;', Context.Empty, {
            source: `var a = (b) => c;`,
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
                                    "type": "ArrowFunctionExpression",
                                    "body": {
                                        "type": "Identifier",
                                        "name": "c"
                                    },
                                    "params": [
                                        {
                                            "type": "Identifier",
                                            "name": "b"
                                        }
                                    ],
                                    "id": null,
                                    "async": false,
                                    "generator": false,
                                    "expression": true
                                },
                                "id": {
                                    "type": "Identifier",
                                    "name": "a"
                                }
                            }
                        ]
                    }
                ]
            }
        });

        pass('(x, y)=>x;', Context.Empty, {
            source: `(x, y)=>x;`,
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
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            }
        });
    });
});