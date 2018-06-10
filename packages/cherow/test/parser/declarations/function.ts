import * as t from 'assert';
import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Miscellaneous - Function', () => {

    describe('Failure', () => {

        // Keyword as binding identifier should throw in
        // 'sloppy', 'strict code, and 'module code'
        const invalidFunctionNamesAsKeywords = [
            'break', 'case', 'catch', 'class', 'const', 'continue',
            'debugger', 'default', 'delete', 'do', 'else', 'export',
            'extends', 'finally', 'for', 'function', 'if', 'import',
            'in', 'instanceof', 'new',
            'return', 'super', 'switch', 'this',
            'throw', 'try', 'typeof', 'var', 'void', 'while', 'with',
        ];
        for (const arg of invalidFunctionNamesAsKeywords) {

            it(`function ${arg}() {};`, () => {
                t.throws(() => {
                    parseSource(`function ${arg}() {};`, undefined, Context.Empty);
                });
            });

            it(`function ${arg}() {};`, () => {
                t.throws(() => {
                    parseSource(`function ${arg}() {};`, undefined, Context.Strict | Context.Module);
                });
            });
        }

        const Failures = [
            'function trailing_comma(,) {}',
            'try function foo() {} catch (e) {}',
            'do function foo() {} while (0);',
            'for (;false;) function foo() {}',
            'do function foo() {} while (0);',
            'for (;false;) function foo() {}',
            'for (var i = 0; i < 1; i++) function f() { };',
            'for (var x in {a: 1}) function f() { };',
            'for (var x in {}) function f() { };',
            'for (var x in {}) function foo() {}',
            'for (x in {a: 1}) function f() { };',
            'for (x in {}) function f() { };',
            'var x; for (x in {}) function foo() {}',
            'with ({}) function f() { };',
            'do label: function foo() {} while (0);',
            'for (;false;) label: function foo() {}',
            'for (var i = 0; i < 1; i++) label: function f() { };',
            'for (var x in {a: 1}) label: function f() { };',
            'for (var x in {}) label: function f() { };',
            'for (var x in {}) label: function foo() {}',
            'for (x in {a: 1}) label: function f() { };',
            'for (x in {}) label: function f() { };',
            'var x; for (x in {}) label: function foo() {}',
            'with ({}) label: function f() { };',
            'if (true) label: function f() {}',
            'if (true) {} else label: function f() {}',
            'if (true) function* f() { }',
            'label: function* f() { }',
            'if (true) async function f() { }',
            'label: async function f() { }',
            'if (true) async function* f() { }',
            'label: async function* f() { }',
            'function eval() { "use strict"; }',
            'function package() { "use strict"; }',
            'function arguments() { "use strict"; }',
            'function implements() { "use strict"; }',
            'function static() { "use strict"; }',
            '"use strict"; function f(){01;}',
            '"use strict"; function f(){("\\1");}',
            'function arguments(eval) { "use strict"; eval = arguments; function foo() { "use strict"; } }',
            'function arguments() { }',
            'function obj.tt() {}',
            'function foo(eval) { }',
            'function foo(eval) { "use strict"; }',
            '"use strict";function _13_1_15_fun(eval) { }',
        ];

        for (const arg of Failures) {
            it(`"use strict"; ${arg}`, () => {
                t.throws(() => {
                    parseSource(`"use strict"; ${arg}`, undefined, Context.Empty);
                });
            });
        }

        fail('function foo(bar, interface) { "use strict"; }', Context.Empty, {
            source: 'function foo(bar, interface) { "use strict"; }',
        });

        fail('function interface(bar, baz) { "use strict"; }', Context.Empty, {
            source: 'function interface(bar, baz) { "use strict"; }',
        });

        fail('function foo(bar, interface) { "use strict"; }', Context.Empty, {
            source: 'function foo(bar, interface) { "use strict"; }',
        });

        fail('function foo(bar, interface) { "use strict"; }', Context.Empty, {
            source: 'function foo(bar, interface) { "use strict"; }',
        });
        fail('function santa() { function eval() { "use strict"; }}', Context.Empty, {
            source: 'function santa() { function eval() { "use strict"; }}',
        });;

        fail('function () {}', Context.Empty, {
            source: 'function () {}',
        });

     //   fail('a: function* a(){}', Context.Empty, {
     //       source: 'a: function* a(){}',
        //});

        fail('for(;;) function a(){}', Context.Empty, {
            source: 'for(;;) function a(){}',
        });

        fail('while(true) function a(){}', Context.Empty, {
            source: 'while(true) function a(){}',
        });

        fail('with(true) function a(){}', Context.Empty, {
            source: 'with(true) function a(){}',
        });

        fail('with(true) function a(){}', Context.Strict | Context.Module, {
            source: 'with(true) function a(){}',
        });

        fail('"use strict"; function eval() { }', Context.Empty, {
            source: '"use strict"; function eval() { }',
        });

        fail('function eval() { }', Context.Module | Context.Strict, {
            source: 'function eval() { }',
        });

        fail('function eval() { "use strict"; }', Context.Empty, {
            source: 'function eval() { "use strict"; }',
        });

        fail('function f(a = 0) { "use strict"; }', Context.Empty, {
            source: 'function f(a = 0) { "use strict"; }',
        });

        fail('function f([...{ x }, y] = [1, 2, 3]) {}', Context.Empty, {
            source: 'function f([...{ x }, y] = [1, 2, 3]) {}',
        });

        fail('function f([...x, y] = [1, 2, 3]) {}', Context.Empty, {
            source: 'function f([...x, y] = [1, 2, 3]) {}',
        });

        fail('function f([...x, y] = [1, 2, 3]) {}', Context.Strict, {
            source: 'function f([...x, y] = [1, 2, 3]) {}',
        });

        fail('function f([...[x], y] = [1, 2, 3]) {}', Context.Empty, {
            source: 'function f([...[x], y] = [1, 2, 3]) {}',
        });

        fail('function f([...[ x ] = []] = []) {}', Context.Empty, {
            source: 'function f([...[ x ] = []] = []) {}',
        });

        fail('function f([...{ x }, y]) {}', Context.Empty, {
            source: 'function f([...{ x }, y]) {}',
        });

        fail('function f([...x, y]) {}', Context.Empty, {
            source: 'function f([...x, y]) {}',
        });

        fail('function f([...[x], y]) {}', Context.Empty, {
            source: 'function f([...[x], y]) {}',
        });

        fail('function f(...x = []) {}', Context.Empty, {
            source: 'function f(...x = []) {}',
        });

        fail('"use strict"; var _13_1_4_fun = function (arguments) { };', Context.Empty, {
            source: '"use strict"; var _13_1_4_fun = function (arguments) { };',
        });

        fail('"use strict"; function eval() {}', Context.Empty, {
            source: '"use strict"; function eval() {}',
        });

        fail('"use strict"; function yield() {}', Context.Empty, {
            source: '"use strict"; function yield() {}',
        });

        fail('"use strict"; function interface() {}', Context.Empty, {
            source: '"use strict"; function interface() {}',
        });

        fail('"use strict"; function foo(yield) {}', Context.Empty, {
            source: '"use strict"; function foo(yield) {}',
        });

        fail('"use strict"; function foo(bar, eval) {}', Context.Empty, {
            source: '"use strict"; function foo(bar, eval) {}',
        });

        fail('"use strict"; function foo(bar, yield) {}', Context.Empty, {
            source: '"use strict"; function foo(bar, yield) {}',
        });

        fail('"use strict"; function foo(bar, interface) {}', Context.Empty, {
            source: '"use strict"; function foo(bar, interface) {}',
        });

        fail('"use strict"; function _13_1_1_fun(eval) { }', Context.Empty, {
            source: '"use strict"; function _13_1_1_fun(eval) { }',
        });

        fail('"use strict"; function _13_1_1_fun(eval) { }', Context.Empty, {
            source: '"use strict"; function _13_1_1_fun(eval) { }',
        });

        fail('function foo(bar, eval) { "use strict"; }', Context.Empty, {
             source: 'function foo(bar, eval) { "use strict"; }',
        });
    });

    describe('Pass', () => {

        const programs = [
            'if (true) function foo() {}',
            'if (false) {} else function f() { };',
            'label: function f() { }',
            'label: if (true) function f() { }',
            'label: if (true) {} else function f() { }',
            'label: label2: function f() { }',
            'function f() { ++(yield); }',
            'function f(a, a) {}',
            'function f(a, a) { function f(a, a) {} }',
            'function f(arg) {g(arg); arg = 42; g(arg)}',
            'function f(arg) {g(arg); g(() => arg = 42); g(arg)}',
            'function f(arg) {g(arg); h(arguments); g(arg)}',
            'function foo() { label: function bar() { } }',
            'function foo () {"use strict";}',
            'function __func(){};',
            '"use strict"; (function(){}).hasOwnProperty("icefapper");',
            'function __func(){ delete arguments; return arguments; }',
            'function hello() { say_hi_to_ariya(); }',
            'function arguments() { }',
            'function hello(a, b) { sayHi(); }',
            'var hi = function eval() { };',
            'var hi = function arguments() { };',
            '(function(){})',
            'function test() { "use strict" + 42; }',
            'function test(t, t) { }',
            'function hello() { z(); }',
            'function hello(a) { z(); }',
            'function eval() { function inner() { \"use strict\" } }',
            'function hello(a, b) { z(); }',
            'function test() { \"use strict\"\n + 0; }',
            'function a() {} function a() {}',
            'function a() { function a() {} function a() {} }',
            'function arguments() { }',
            'function arguments() { function foo() { "use strict"; } }',
            'function arguments(eval) { function foo() { "use strict"; } }',
            'function arguments(eval) { function foo() { "use strict"; } function eval() {} }',
            'function arguments() { eval = arguments; function foo() { "use strict"; } }',
            'function arguments(eval) { eval = arguments; function foo() { "use strict"; } }',
            'function arguments(eval) { eval = arguments; function foo() { "use strict"; } "use strict"; }',
            'function f([x]) {}',
            'function f([[,] = g()]) {}',
            'function f([[...x] = function() {}()]) {}',
            'function f([x = 23]) {}',
            'function f([{ x, y, z } = { x: 44, y: 55, z: 66 }]) {}',
            'function f([...x]) {}',
            'function f([x = 23] = []) {}',
            'function f([{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]) {}',
            'function f([...[]] = function*() {}) {}',
            'function f({ x, } = { x: 23 }) {}',
            'function f({ w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: { x: undefined, z: 7 } }) {}',
            'function f({ x, }) {}',
            'function f({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) {}',
            `function
            x
            (
            )
            {
            }
            ;`,
            `function                                                    y                                   (                                          )                                              {};
            y();
            `,
            `function
            z
            (
            )
            {
            }
            ;
            `,
            'function ref(a,) {}',
            'function universe(__proto__) { }'
        ];

        for (const arg of programs) {
            it(`${arg}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`${arg}`, undefined, Context.Empty);
                });
            });
        }

        pass('function f(){}', Context.OptionsNext, {
            source: `function f(){}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
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
                            "name": "f"
                        }
                    }
                ]
            }
        });

        pass('{{{ function g() {} }}}', Context.OptionsNext, {
            source: `{{{ function g() {} }}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "BlockStatement",
                        "body": [
                            {
                                "type": "BlockStatement",
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
                                                    "name": "g"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });

        pass('if (x) { function g() {} }', Context.OptionsNext, {
            source: `if (x) { function g() {} }`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "IfStatement",
                        "test": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "consequent": {
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
                                        "name": "g"
                                    }
                                }
                            ]
                        },
                        "alternate": null
                    }
                ]
            }
        });

        pass('function f(a,b){}', Context.OptionsNext, {
            source: `function f(a,b){}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "FunctionDeclaration",
                        "params": [
                            {
                                "type": "Identifier",
                                "name": "a"
                            },
                            {
                                "type": "Identifier",
                                "name": "b"
                            }
                        ],
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
        });

        pass('function f(a=b=c){}', Context.OptionsNext, {
            source: `function f(a=b=c){}`,
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
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "b"
                                    },
                                    "operator": "=",
                                    "right": {
                                        "type": "Identifier",
                                        "name": "c"
                                    }
                                }
                            }
                        ],
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
        });

        pass('function f([] = x){}', Context.OptionsNext, {
            source: `function f([] = x){}`,
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
                                    "type": "ArrayPattern",
                                    "elements": []
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            }
                        ],
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
        });

        pass('function f([foo], [foo]){}', Context.OptionsNext, {
            source: `function f([foo], [foo]){}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "FunctionDeclaration",
                        "params": [
                            {
                                "type": "ArrayPattern",
                                "elements": [
                                    {
                                        "type": "Identifier",
                                        "name": "foo"
                                    }
                                ]
                            },
                            {
                                "type": "ArrayPattern",
                                "elements": [
                                    {
                                        "type": "Identifier",
                                        "name": "foo"
                                    }
                                ]
                            }
                        ],
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
        });

        pass('function f([x, ...[a, b]] = obj){}', Context.OptionsNext, {
            source: `function f([x, ...[a, b]] = obj){}`,
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
                                    "type": "ArrayPattern",
                                    "elements": [
                                        {
                                            "type": "Identifier",
                                            "name": "x"
                                        },
                                        {
                                            "type": "RestElement",
                                            "argument": {
                                                "type": "ArrayPattern",
                                                "elements": [
                                                    {
                                                        "type": "Identifier",
                                                        "name": "a"
                                                    },
                                                    {
                                                        "type": "Identifier",
                                                        "name": "b"
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "obj"
                                }
                            }
                        ],
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
        });

        pass('function f({foo=a,bar} = x){}', Context.OptionsNext, {
            source: `function f({foo=a,bar} = x){}`,
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
                                                    "type": "Identifier",
                                                    "name": "a"
                                                }
                                            },
                                            "method": false,
                                            "shorthand": true
                                        },
                                        {
                                            "type": "Property",
                                            "kind": "init",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "bar"
                                            },
                                            "computed": false,
                                            "value": {
                                                "type": "Identifier",
                                                "name": "bar"
                                            },
                                            "method": false,
                                            "shorthand": true
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            }
                        ],
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
        });

        pass('function f({foo:a,bar:b} = x){}', Context.OptionsNext, {
            source: `function f({foo:a,bar:b} = x){}`,
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
                                                "type": "Identifier",
                                                "name": "a"
                                            },
                                            "method": false,
                                            "shorthand": false
                                        },
                                        {
                                            "type": "Property",
                                            "kind": "init",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "bar"
                                            },
                                            "computed": false,
                                            "value": {
                                                "type": "Identifier",
                                                "name": "b"
                                            },
                                            "method": false,
                                            "shorthand": false
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            }
                        ],
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
        });

        pass('function f({foo=a,bar} = x){}', Context.OptionsNext, {
            source: `function f({foo=a,bar} = x){}`,
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
                                                    "type": "Identifier",
                                                    "name": "a"
                                                }
                                            },
                                            "method": false,
                                            "shorthand": true
                                        },
                                        {
                                            "type": "Property",
                                            "kind": "init",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "bar"
                                            },
                                            "computed": false,
                                            "value": {
                                                "type": "Identifier",
                                                "name": "bar"
                                            },
                                            "method": false,
                                            "shorthand": true
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            }
                        ],
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
        });

        pass('function f({foo} = x, {foo} = y){}', Context.OptionsNext, {
            source: `function f({foo} = x, {foo} = y){}`,
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
                                                "type": "Identifier",
                                                "name": "foo"
                                            },
                                            "method": false,
                                            "shorthand": true
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            },
                            {
                                "type": "AssignmentPattern",
                                "left": {
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
                                                "type": "Identifier",
                                                "name": "foo"
                                            },
                                            "method": false,
                                            "shorthand": true
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            }
                        ],
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
        });

        pass('function f([,foo] = x){}', Context.OptionsNext, {
            source: `function f([,foo] = x){}`,
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
                                    "type": "ArrayPattern",
                                    "elements": [
                                        null,
                                        {
                                            "type": "Identifier",
                                            "name": "foo"
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            }
                        ],
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
        });

        pass('function f([foo=a] = c){}', Context.OptionsNext, {
            source: `function f([foo=a] = c){}`,
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
                                    "type": "ArrayPattern",
                                    "elements": [
                                        {
                                            "type": "AssignmentPattern",
                                            "left": {
                                                "type": "Identifier",
                                                "name": "foo"
                                            },
                                            "right": {
                                                "type": "Identifier",
                                                "name": "a"
                                            }
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "c"
                                }
                            }
                        ],
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
        });

        pass('function f([] = x){}', Context.OptionsNext, {
            source: `function f([] = x){}`,
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
                                    "type": "ArrayPattern",
                                    "elements": []
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            }
                        ],
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
        });

        pass('function f([,] = x){}', Context.OptionsNext, {
            source: `function f([,] = x){}`,
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
                                    "type": "ArrayPattern",
                                    "elements": [
                                        null
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            }
                        ],
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
        });

        pass('function f([,,foo] = x){}', Context.OptionsNext, {
            source: `function f([,,foo] = x){}`,
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
                                    "type": "ArrayPattern",
                                    "elements": [
                                        null,
                                        null,
                                        {
                                            "type": "Identifier",
                                            "name": "foo"
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "x"
                                }
                            }
                        ],
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
        });
    });

});