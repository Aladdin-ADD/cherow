import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Object literal', () => {

    describe('Pass', () => {

        pass('({*[a](){}})', Context.Empty, {
            source: `({*[a](){}})`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "Property",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "a"
                                    },
                                    "value": {
                                        "type": "FunctionExpression",
                                        "params": [],
                                        "body": {
                                            "type": "BlockStatement",
                                            "body": []
                                        },
                                        "async": false,
                                        "generator": true,
                                        "expression": false,
                                        "id": null
                                    },
                                    "kind": "init",
                                    "computed": true,
                                    "method": true,
                                    "shorthand": false
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('foo = {[a]:b=x}', Context.Empty, {
            source: `foo = {[a]:b=x}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
                                            "type": "AssignmentExpression",
                                            "left": {
                                                "type": "Identifier",
                                                "name": "b"
                                            },
                                            "operator": "=",
                                            "right": {
                                                "type": "Identifier",
                                                "name": "x"
                                            }
                                        },
                                        "kind": "init",
                                        "computed": true,
                                        "method": false,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {set [a](x){}}', Context.Empty, {
            source: `foo = {set [a](x){}}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
                                            "type": "FunctionExpression",
                                            "params": [
                                                {
                                                    "type": "Identifier",
                                                    "name": "x"
                                                }
                                            ],
                                            "body": {
                                                "type": "BlockStatement",
                                                "body": []
                                            },
                                            "async": false,
                                            "generator": false,
                                            "expression": false,
                                            "id": null
                                        },
                                        "kind": "set",
                                        "computed": true,
                                        "method": false,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {async a(){}}', Context.Empty, {
            source: `foo = {async a(){}}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
                                            "type": "FunctionExpression",
                                            "params": [],
                                            "body": {
                                                "type": "BlockStatement",
                                                "body": []
                                            },
                                            "async": true,
                                            "generator": false,
                                            "expression": false,
                                            "id": null
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": true,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {async *a(){}}', Context.Empty, {
            source: `foo = {async *a(){}}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
                                            "type": "FunctionExpression",
                                            "params": [],
                                            "body": {
                                                "type": "BlockStatement",
                                                "body": []
                                            },
                                            "async": true,
                                            "generator": true,
                                            "expression": false,
                                            "id": null
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": true,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {get a(){}}', Context.Empty, {
            source: `foo = {get [a](){}}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
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
                                        },
                                        "kind": "get",
                                        "computed": true,
                                        "method": false,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {get a(){}}', Context.Empty, {
            source: `foo = {get a(){}}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
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
                                        },
                                        "kind": "get",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {set a(x){}}', Context.Empty, {
            source: `foo = {set a(x){}}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
                                            "type": "FunctionExpression",
                                            "params": [
                                                {
                                                    "type": "Identifier",
                                                    "name": "x"
                                                }
                                            ],
                                            "body": {
                                                "type": "BlockStatement",
                                                "body": []
                                            },
                                            "async": false,
                                            "generator": false,
                                            "expression": false,
                                            "id": null
                                        },
                                        "kind": "set",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {async [a](){}}', Context.Empty, {
            source: `foo = {async [a](){}}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
                                            "type": "FunctionExpression",
                                            "params": [],
                                            "body": {
                                                "type": "BlockStatement",
                                                "body": []
                                            },
                                            "async": true,
                                            "generator": false,
                                            "expression": false,
                                            "id": null
                                        },
                                        "kind": "init",
                                        "computed": true,
                                        "method": true,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {*a(){}}', Context.Empty, {
            source: `foo = {*a(){}}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
                                            "type": "FunctionExpression",
                                            "params": [],
                                            "body": {
                                                "type": "BlockStatement",
                                                "body": []
                                            },
                                            "async": false,
                                            "generator": true,
                                            "expression": false,
                                            "id": null
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": true,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = { async }', Context.Empty, {
            source: `foo = { async }`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "async"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "async"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": true
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = { aync: await }', Context.Empty, {
            source: `foo = { async: bar }`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "async"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "bar"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = { aync, get, set }', Context.Empty, {
            source: `foo = { aync, get, set }`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "aync"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "aync"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": true
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "get"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "get"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": true
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "set"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "set"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": true
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = { a, b, c }', Context.Empty, {
            source: `foo = { a, b, c }`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "a"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": true
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "b"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "b"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": true
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "c"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "c"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": true
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo({});', Context.Empty, {
            source: `foo({});`,
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
                                    "type": "ObjectExpression",
                                    "properties": []
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('foo({a});', Context.Empty, {
            source: `foo({a});`,
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
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "a"
                                            },
                                            "value": {
                                                "type": "Identifier",
                                                "name": "a"
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": true
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('foo = {async};', Context.Empty, {
            source: `foo = {async};`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "async"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "async"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": true
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo = {get:b}', Context.Empty, {
            source: `foo = {get:b}`,
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
                                "name": "foo"
                            },
                            "operator": "=",
                            "right": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "get"
                                        },
                                        "value": {
                                            "type": "Identifier",
                                            "name": "b"
                                        },
                                        "kind": "init",
                                        "computed": false,
                                        "method": false,
                                        "shorthand": false
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });

        pass('foo({async:b});', Context.Empty, {
            source: `foo({async:b});`,
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
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "async"
                                            },
                                            "value": {
                                                "type": "Identifier",
                                                "name": "b"
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('foo({a:b});', Context.Empty, {
            source: `foo({a:b});`,
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
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": 'a'
                                            },
                                            "value": {
                                                "type": "Identifier",
                                                "name": "b"
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('wrap({a, c:d});', Context.Empty, {
            source: `wrap({a, c:d});`,
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
                                "name": "wrap"
                            },
                            "arguments": [
                                {
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "a"
                                            },
                                            "value": {
                                                "type": "Identifier",
                                                "name": "a"
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": true
                                        },
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "c"
                                            },
                                            "value": {
                                                "type": "Identifier",
                                                "name": "d"
                                            },
                                            "kind": "init",
                                            "computed": false,
                                            "method": false,
                                            "shorthand": false
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        });
    });
});