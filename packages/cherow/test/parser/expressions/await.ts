import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Await', () => {

    describe('Pass', () => {

        pass('await', Context.Empty, {
            source: `await`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "Identifier",
                            "name": "await"
                        }
                    }
                ]
            }
        });

        pass('let y = async x => await x', Context.Empty, {
            source: `let y = async x => await x`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "VariableDeclaration",
                        "kind": "let",
                        "declarations": [
                            {
                                "type": "VariableDeclarator",
                                "init": {
                                    "type": "ArrowFunctionExpression",
                                    "body": {
                                        "type": "AwaitExpression",
                                        "argument": {
                                            "type": "Identifier",
                                            "name": "x"
                                        }
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

        pass('async function f(){ await await foo; }', Context.Empty, {
            source: `async function f(){ await await foo; }`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "FunctionDeclaration",
                        "params": [],
                        "body": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "AwaitExpression",
                                        "argument": {
                                            "type": "AwaitExpression",
                                            "argument": {
                                                "type": "Identifier",
                                                "name": "foo"
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        "async": true,
                        "generator": false,
                        "expression": false,
                        "id": {
                            "type": "Identifier",
                            "name": "f"
                        }
                    }
                ]
            }
        });
    });
});