import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - New target', () => {
/*
    describe('Editor mode', () => {

        // Arrow in global scope
        pass('() => {new.target }', Context.OptionsEditorMode, {
            source: `() => {new.target }`,
            expected: {
                  "body": [
                   {
                      "expression": {
                        "async": false,
                        "body": {
                          "body": [
                            {
                              "expression": undefined,
                              "type": "ExpressionStatement",
                            },
                            {
                              "expression": {
                               "name": "target",
                                "type": "Identifier",
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
        });
    });*/

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
        });
    });
});
