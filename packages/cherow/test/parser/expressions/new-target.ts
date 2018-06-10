import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Expressions - New target', () => {

    describe('Pass', () => {

        const validCombos = [
            'function foo(){with({}) {new.target;}}',
            'function foo(){{if(true){new.target;}}}',
            'function foo(){ var x = function() {new.target;}; x();}',
        //    'function foo(){ var o = { "foo" : function () { new.target}}; o.foo();}',
        ];
        for (const arg of validCombos) {

            it(`${arg}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
                });
            });
        }

        const validSyntax = [
            'new.target',
            '{ new.target }',
            '() => { new.target }',
            '() => new.target',
            'if (1) { new.target }',
            'if (1) {} else { new.target }',
            'while (0) { new.target }',
            'do { new.target } while (0)',
            'function a(b = new.target){}',
            'class C {get x() { { new.target } }}',
            'class C {get x() { () => new.target }}',
            'class C {get x() { do { new.target } while (0) }}',
            'function f() { new.target }',
            'function f() { () => new.target }',
            'function f() { if (1) { new.target } }',
            'function f() { while (0) { new.target } }',
            'function f() { do { new.target } while (0) }',
            `function a(){{if(true){new.target;}}}`,
            `function abc(){ var a = b = c = 1; try {} catch([a,b,c]) { new.target;}}`,
            // `function a(){ var o = { "foo" : function () { new.target}}; o.foo();}`,
            '({ set a(b = new.target){} })',
            '(function a(b = new.target){})',
            'function f() { let x = new.target; }',
            'function f() { new new.target()(); }',
            'function f() { new.target(); }',
        ];
        for (const arg of validSyntax) {

            it(`function f() {${arg}}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`function f() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
                });
            });

            it(`'use strict'; function f() {${arg}}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`'use strict'; function f() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
                });
            });

            it(`var f = function() {${arg}}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`var f = function() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
                });
            });

            it(`({m: function() {${arg}}})`, () => {
                t.doesNotThrow(() => {
                    parseSource(`({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
                });
            });

            it(`({set x(_) {${arg}}})`, () => {
                t.doesNotThrow(() => {
                    parseSource(`({set x(_) {${arg}}})`, undefined, Context.OptionsNext);
                });
            });

            it(`'use strict'; ({get x() {${arg}}})`, () => {
                t.doesNotThrow(() => {
                    parseSource(`'use strict'; ({get x() {${arg}}})`, undefined, Context.Empty);
                });
            });

            it(`({m: function() {${arg}}})`, () => {
                t.doesNotThrow(() => {
                    parseSource(`({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
                });
            });

            it(`'use strict'; ({m: function() {${arg}}})`, () => {
                t.doesNotThrow(() => {
                    parseSource(`'use strict'; ({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
                });
            });

            it(`class C {m() {${arg}}}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`class C {m() {${arg}}}`, undefined, Context.Empty);
                });
            });

            it(`class C {set x(_) {${arg}}}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`class C {set x(_) {${arg}}}`, undefined, Context.OptionsNext | Context.Module);
                });
            });
        }


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
});
