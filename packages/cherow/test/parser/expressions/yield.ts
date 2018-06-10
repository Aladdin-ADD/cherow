import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Yield', () => {

    describe('Pass', () => {

        pass('yield', Context.Empty, {
            source: `yield`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "Identifier",
                            "name": "yield"
                        }
                    }
                ]
            }
        });

        pass('function* f(){ yield; }', Context.Empty, {
            source: `function* f(){ yield; }`,
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
                                        "type": "YieldExpression",
                                        "argument": null,
                                        "delegate": false
                                    }
                                }
                            ]
                        },
                        "async": false,
                        "generator": true,
                        "expression": false,
                        "id": {
                            "type": "Identifier",
                            "name": "f"
                        }
                    }
                ]
            }
        });

        pass('function* f(){ call(yield); }', Context.Empty, {
            source: `function* f(){ call(yield); }`,
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
                                        "type": "CallExpression",
                                        "callee": {
                                            "type": "Identifier",
                                            "name": "call"
                                        },
                                        "arguments": [
                                            {
                                                "type": "YieldExpression",
                                                "argument": null,
                                                "delegate": false
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "async": false,
                        "generator": true,
                        "expression": false,
                        "id": {
                            "type": "Identifier",
                            "name": "f"
                        }
                    }
                ]
            }
        });

        pass('function* f(){ yield x + y; }', Context.Empty, {
            source: `function* f(){ yield x + y; }`,
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
                                        "type": "YieldExpression",
                                        "argument": {
                                            "type": "BinaryExpression",
                                            "left": {
                                                "type": "Identifier",
                                                "name": "x"
                                            },
                                            "right": {
                                                "type": "Identifier",
                                                "name": "y"
                                            },
                                            "operator": "+"
                                        },
                                        "delegate": false
                                    }
                                }
                            ]
                        },
                        "async": false,
                        "generator": true,
                        "expression": false,
                        "id": {
                            "type": "Identifier",
                            "name": "f"
                        }
                    }
                ]
            }
        });

        pass('function* f(){ call(yield x + y); }', Context.Empty, {
            source: `function* f(){ call(yield x + y); }`,
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
                                        "type": "CallExpression",
                                        "callee": {
                                            "type": "Identifier",
                                            "name": "call"
                                        },
                                        "arguments": [
                                            {
                                                "type": "YieldExpression",
                                                "argument": {
                                                    "type": "BinaryExpression",
                                                    "left": {
                                                        "type": "Identifier",
                                                        "name": "x"
                                                    },
                                                    "right": {
                                                        "type": "Identifier",
                                                        "name": "y"
                                                    },
                                                    "operator": "+"
                                                },
                                                "delegate": false
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        "async": false,
                        "generator": true,
                        "expression": false,
                        "id": {
                            "type": "Identifier",
                            "name": "f"
                        }
                    }
                ]
            }
        });

        pass('function* f(){ yield x; }', Context.Empty, {
            source: `function* f(){ yield x; }`,
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
                                        "type": "YieldExpression",
                                        "argument": {
                                            "type": "Identifier",
                                            "name": "x"
                                        },
                                        "delegate": false
                                    }
                                }
                            ]
                        },
                        "async": false,
                        "generator": true,
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