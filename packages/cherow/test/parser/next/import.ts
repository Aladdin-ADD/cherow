import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Miscellaneous - Import', () => {

    describe('Pass', () => {

        pass('import(1)', Context.OptionsNext | Context.Module, {
            source: `import(1)`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Import"
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": 1
                                }
                            ]
                        }
                    }
                ]
            } 
        });

        pass('import(1)', Context.OptionsNext | Context.Module, {
            source: `import(1)`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Import"
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": 1
                                }
                            ]
                        }
                    }
                ]
            } 
        });

        pass("import(x).then()", Context.OptionsNext | Context.Module, {
            source: `import(x).then()`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "MemberExpression",
                                "object": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "Import"
                                    },
                                    "arguments": [
                                        {
                                            "type": "Identifier",
                                            "name": "x"
                                        }
                                    ]
                                },
                                "computed": false,
                                "property": {
                                    "type": "Identifier",
                                    "name": "then"
                                }
                            },
                            "arguments": []
                        }
                    }
                ]
            }
        });

        pass("x = import(x)", Context.OptionsNext | Context.Module, {
            source: `x = import(x)`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "left": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "operator": "=",
                            "right": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Import"
                                },
                                "arguments": [
                                    {
                                        "type": "Identifier",
                                        "name": "x"
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass("(import(y=x))", Context.OptionsNext | Context.Module, {
            source: `(import(y=x))`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Import"
                            },
                            "arguments": [
                                {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "y"
                                    },
                                    "operator": "=",
                                    "right": {
                                        "type": "Identifier",
                                        "name": "x"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass("import('./module.js')", Context.OptionsNext | Context.Module, {
            source: `import('./module.js')`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Import"
                            },
                            "arguments": [
                                {
                                    "type": "Literal",
                                    "value": "./module.js"
                                }
                            ]
                        }
                    }
                ]
            }
        });
    });
});