import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Miscellaneous - New target', () => {

    describe('Editor mode', () => {

        // Arrow in global scope
        pass('() => {new.target }', Context.Empty, {
            source: `() => {new.target }`,
            expected: {
                  "body": [
                    {
                      "expression": {
                        "async": false,
                        "body": {
                          "body": [
                            {
                              "expression": {
                                "arguments": [],
                                "callee": {
                                  "name": "target",
                                  "type": "Identifier",
                                },
                                "type": "NewExpression",
                              },
                              "type": "ExpressionStatement",
                            },
                          ],
                          "type": "BlockStatement",
                        },
                        "expression": false,
                        "generator": false,
                        "id": null,
                        "params": [],
                        "type": "ArrowFunctionExpression",
                      },
                      "type": "ExpressionStatement",
                    },
                  ],
                  "sourceType": "script",
                  "type": "Program"
                }
           
        },  (msg: string) => {
            t.equal(msg, 'new.target expression is not allowed here');
        });
    });

    describe('Pass', () => {

        pass('function foo() { () => {new.target } }', Context.Empty, {
            source: `function foo() { () => {new.target } }`,
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
                                        "type": "ArrowFunctionExpression",
                                        "body": {
                                            "type": "BlockStatement",
                                            "body": [
                                                {
                                                    "type": "ExpressionStatement",
                                                    "expression": {
                                                        "meta": {
                                                            "type": "Identifier",
                                                            "name": "new"
                                                        },
                                                        "type": "MetaProperty",
                                                        "property": {
                                                            "type": "Identifier",
                                                            "name": "target"
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        "params": [],
                                        "id": null,
                                        "async": false,
                                        "generator": false,
                                        "expression": false
                                    }
                                }
                            ]
                        },
                        "async": false,
                        "generator": false,
                        "expression": false,
                        "id": {
                            "type": "Identifier",
                            "name": "foo"
                        }
                    }
                ]
            }           
        },  (msg: string) => {
            t.equal(msg, 'new.target expression is not allowed here');
        });
    });
});