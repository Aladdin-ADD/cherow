import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Function', () => {

    describe('Pass', () => {

        pass('(function(){})', Context.Empty, {
            source: `(function(){})`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "FunctionExpression",
                            "params": [],
                            "body": {
                                "type": "BlockStatement",
                                "body": []
                            },
                            "async": false,
                            "generator": false,
                            "expression": false,
                            "id": null
                        }
                    }
                ]
            }
        });

        pass('foo(function f(){})', Context.Empty, {
            source: `foo(function f(){})`,
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
                                    "type": "FunctionExpression",
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
                                        "name": "f"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('typeof function f(){}\nfunction f(){}', Context.Empty, {
            source: `typeof function f(){}\nfunction f(){}`,
            expected: {
                  "body": [
                    {
                     "expression": {
                        "argument": {
                          "async": false,
                          "body": {
                            "body": [],
                            "type": "BlockStatement",
                          },
                          "expression": false,
                          "generator": false,
                          "id": {
                            "name": "f",
                           "type": "Identifier",
                          },
                          "params": [],
                          "type": "FunctionExpression",
                        },
                        "operator": "typeof",
                        "prefix": true,
                        "type": "UnaryExpression",
                      },
                      "type": "ExpressionStatement",
                    },
                    {
                      "async": false,
                      "body": {
                        "body": [],
                        "type": "BlockStatement",
                      },
                      "expression": false,
                      "generator": false,
                      "id": {
                        "name": "f",
                        "type": "Identifier",
                      },
                      "params": [],
                      "type": "FunctionDeclaration",
                    },
                  ],
                  "sourceType": "script",
                  "type": "Program"
                }
        });
    });
});