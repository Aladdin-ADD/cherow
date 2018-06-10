import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Miscellaneous - Import meta', () => {

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

        pass('() => import.meta', Context.OptionsNext | Context.Module, {
            source: `() => import.meta`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ArrowFunctionExpression",
                            "body": {
                                "meta": {
                                    "type": "Identifier",
                                    "name": "import"
                                },
                                "type": "MetaProperty",
                                "property": {
                                    "type": "Identifier",
                                    "name": "meta"
                                }
                            },
                            "params": [],
                            "id": null,
                            "async": false,
                            "generator": false,
                            "expression": true
                        }
                    }
                ]
            } 
        });

        pass('if (1) {} else { import.meta }', Context.OptionsNext | Context.Module, {
            source: `if (1) {} else { import.meta }`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "IfStatement",
                        "test": {
                            "type": "Literal",
                            "value": 1
                        },
                        "consequent": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "alternate": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "meta": {
                                            "type": "Identifier",
                                            "name": "import"
                                        },
                                        "type": "MetaProperty",
                                        "property": {
                                            "type": "Identifier",
                                            "name": "meta"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('() => { import.meta }', Context.OptionsNext | Context.Module, {
            source: `() => { import.meta }`,
            expected: {
                "type": "Program",
                "sourceType": "module",
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
                                                "name": "import"
                                            },
                                            "type": "MetaProperty",
                                            "property": {
                                                "type": "Identifier",
                                                "name": "meta"
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
            }
        });

        pass('new import.meta', Context.OptionsNext | Context.Module, {
            source: `new import.meta`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "NewExpression",
                            "callee": {
                                "meta": {
                                    "type": "Identifier",
                                    "name": "import"
                                },
                                "type": "MetaProperty",
                                "property": {
                                    "type": "Identifier",
                                    "name": "meta"
                                }
                            },
                            "arguments": []
                        }
                    }
                ]
            }
        });

        pass('delete import.meta', Context.OptionsNext | Context.Module, {
            source: `delete import.meta`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "UnaryExpression",
                            "operator": "delete",
                            "argument": {
                                "meta": {
                                    "type": "Identifier",
                                    "name": "import"
                                },
                                "type": "MetaProperty",
                                "property": {
                                    "type": "Identifier",
                                    "name": "meta"
                                }
                            },
                            "prefix": true
                        }
                    }
                ]
            } 
        });
 });
});