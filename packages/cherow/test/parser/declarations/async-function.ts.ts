import * as t from 'assert';
import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Miscellaneous - Async Function', () => {

    describe('Failure', () => {

        const Failures = [
            'async function foo() { async function bar(a = await baz()) {} }',
            
        ];

        for (const arg of Failures) {
            it(`"use strict"; ${arg}`, () => {
                t.throws(() => {
                    parseSource(`"use strict"; ${arg}`, undefined, Context.Empty);
                });
            });
        }

        fail('async function foo (foo = super()) { let bar; }', Context.Empty, {
            source: 'async function foo (foo = super()) { let bar; }',
          });
    });

    describe('Pass', () => {

        const programs = [
            'async function wrap() {\n({a = await b} = obj)\n}',
            'async function wrap() {\n(a = await b)\n}',
            'async function foo(a = class {async bar() { await b }}) {}',
            'async function foo(a = {async bar() { await b }}) {}',
            'async function foo(a = async () => await b) {}',
            'async function foo(a = async function foo() { await b }) {}',
            'async function foo() { await + 1 }',
            'async function foo(a, b) { await a + await b }',
            `(async () => { return !await Promise.resolve(false); })();`
        ];

        for (const arg of programs) {
            it(`${arg}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`${arg}`, undefined, Context.Empty);
                });
            });
        }

        pass('async function foo(a = {async bar() { await b }}) {}', Context.OptionsNext, {
            source: `async function foo(a = {async bar() { await b }}) {}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "FunctionDeclaration",
                        "params": [
                            {
                                "type": "AssignmentPattern",
                                "left": {
                                    "type": "Identifier",
                                    "name": "a"
                                },
                                "right": {
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "bar"
                                            },
                                            "value": {
                                                "type": "FunctionExpression",
                                                "params": [],
                                                "body": {
                                                    "type": "BlockStatement",
                                                    "body": [
                                                        {
                                                            "type": "ExpressionStatement",
                                                            "expression": {
                                                                "type": "AwaitExpression",
                                                                "argument": {
                                                                    "type": "Identifier",
                                                                    "name": "b"
                                                                }
                                                            }
                                                        }
                                                    ]
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
                        ],
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
                    }
                ]
            }
        });
 });

});