import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Block', () => {

    pass('{ var {foo=3} = {}; };', Context.Empty, {
        source: '{ var {foo=3} = {}; };',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "VariableDeclaration",
                            "kind": "var",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "init": {
                                        "type": "ObjectExpression",
                                        "properties": []
                                    },
                                    "id": {
                                        "type": "ObjectPattern",
                                        "properties": [
                                            {
                                                "type": "Property",
                                                "kind": "init",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "foo"
                                                },
                                                "computed": false,
                                                "value": {
                                                    "type": "AssignmentPattern",
                                                    "left": {
                                                        "type": "Identifier",
                                                        "name": "foo"
                                                    },
                                                    "right": {
                                                        "type": "Literal",
                                                        "value": 3
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
                },
                {
                    "type": "EmptyStatement"
                }
            ]
        }
    });

    pass('{ function foo() {}; };', Context.Empty, {
        source: '{ function foo() {}; };',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "FunctionDeclaration",
                            "params": [],
                            "body": {
                                "type": "BlockStatement",
                                "body": []
                            },
                            "async": false,
                            "generator": false,
                            "expression": false,
                            "id": {
                                "type": "Identifier",
                                "name": "foo"
                            }
                        },
                        {
                            "type": "EmptyStatement"
                        }
                    ]
                },
                {
                    "type": "EmptyStatement"
                }
            ]
        }
    });

    pass('{ async function foo() {}; };', Context.Empty, {
        source: '{ async function foo() {}; };',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "FunctionDeclaration",
                            "params": [],
                            "body": {
                                "type": "BlockStatement",
                                "body": []
                            },
                            "async": true,
                            "generator": false,
                            "expression": false,
                            "id": {
                                "type": "Identifier",
                                "name": "foo"
                            }
                        },
                        {
                            "type": "EmptyStatement"
                        }
                    ]
                },
                {
                    "type": "EmptyStatement"
                }
            ]
        }
    });

    pass('{ var foo = 0; }', Context.Empty, {
        source: '{ var foo = 0; }',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "BlockStatement",
                    "body": [
                        {
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
                                        "name": "foo"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    });

    pass('{ a(); bt(); }', Context.Empty, {
        source: '{ a(); bt(); }',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "a"
                                },
                                "arguments": []
                            }
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "bt"
                                },
                                "arguments": []
                            }
                        }
                    ]
                }
            ]
        }
    });
});