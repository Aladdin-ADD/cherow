import * as t from 'assert';
import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Module - Export', () => {

    describe('Failures', () => {

        const failures = [
        'export {',
        'export async;',
        'var a; export { a',
        'var a; export { a,',
        'var a; export { a, ;',
        'var a; export { a as };',
        'var a, b; export { a as , b};',
        'class C { method() { export default null; } }',
        '{ export default null; }',
        'class C { *method() { export default null; } }',
        `for (const x = 0; false;)
        export default null;`,
        'switch(0) { case 1: export default null; default: }',
        'switch(0) { case 1: export default null; default: }',
        'export }',
        'var foo, bar; export { foo bar };',
        'export { , };',
        'export default from;',
        'export default;',
        'export default var x = 7;',
        'export default let x = 7;',
        'export default const x = 7;',
        'export *;',
        'export * from;',
        'export { Q } from;',
        'export default from \'module.js\';',
        'export { for }',
        'export { for as foo }',
        'export * as z from "c";',
        'export function() {}',
        'export function*() {}',
        'export class {}',
        'export class extends C {}',
        'export default (function * yield() {})',
        'export default (async function await() {})',
        'export default (async function *await() {})',
        'export default async function await() {}',
        'export async function await() {}',
        'export async function() {}',
        'export async',
        'export async\nfunction async() { await 1; }',
        'export * as namespace from \'./foo\' null;',
        'export {try};',
        'export * +',
        'export default from "foo"',
        'export {default}',
        'export {try as bar};',
        'export var await',
        'export typeof foo;',
        'export new Foo();',
        'export *',
        'export { default }',
        'export { if }',
        'export { default as foo }',
        'export { if as foo }',
        'export * from foo',
        'export { bar } from foo',
        // 'export const const1;',
        'function foo() { }; export foo;',
        'export function () { }',
        'export function* () { }',
        'export B, * as A, { C, D } from "test";',
        // missing binding identifier
        'export class { }',
        'function foo() { }; export [ foo ];',
        'function foo() { export default function() { } }',
        'function foo() { }; export { , foo };',
        'function foo() { }; () => { export { foo }; }',
        'function foo() { }; try { export { foo }; } catch(e) { }',
        // 'Syntax error if export is followed by non-identifier'
        'export 12;',
        'function foo() { }; export { foo as 100 };',
        ];

        for (const arg of failures) {
            it(`${arg}`, () => {
                t.throws(() => {
                    parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
                });
            });
        }
    });

    describe('Pass', () => {

        const programs = [
            'export let x = 0;',
            'export var y = 0;',
            'export const z = 0;',
            'export default x;',
            'export function func() { };',
            'export class C { };',
            'export { };',
            'export { x as default };',
            'function f() {}; f(); export { f };',
            'var a, b, c; export { a, b as baz, c };',
            'var d, e; export { d as dreary, e, };',
            'export default function f() {}',
            'export default function() {}',
            'export default function *a() {}',
            'export var foo = function () {};',
            'export default function*() {}',
            'export default class C {}',
            'export default class {}',
            'export * from "module";',
            'export {name} from "module";',
            'export {a as b, c as d} from "module";',
            'export {e as f, g as h};',
            'export {};',
            'export default i = 42;',
            'export var j = 42;',
            'export let k = 42;',
            'export function l() {}',
            'export default function () {}',
            'export default class extends C {}',
            'export default 42',
            'var x; export default x = 7',
            'export { Q } from \'somemodule.js\';',
            'export * from \'somemodule.js\';',
            'var foo; export { foo as for };',
            'export { arguments } from \'m.js\';',
            'export {foo, bar,};',
            'export { for } from \'m.js\';',
            'export { yield } from \'m.js\'',
            'export { static } from \'m.js\'',
            'export { let } from \'m.js\'',
            'export default [];',
            'export default 42;',
            'export default { foo: 1 };',
            'export * from "foo";',
            'export {default} from "foo";',
            'export {foo as bar} from "foo";',
            'export function *foo () {}',
            'export var foo = 1;',
            'var a; export { a as b, a as c };',
            'var a; export { a as await };',
            'var a; export { a as enum };',
            'export {thing}; import thing from \'a.js\';',
            'export {thing}; import {thing} from \'a.js\';',
            'export {thing}; import * as thing from \'a.js\';',
            'export { x as y };',
            'export { a as b } from \'m.js\';',
            'export * from \'p.js\';',
            'export var foo;',
            'export function goo() {};',
            'export let hoo;',
            `export default class { constructor() {	foo() } a() {	bar()	}	}`,
            'export const joo = 42;',
            'export default (function koo() {});',
            'export {aa as bb, x};',
            'export {foob};',
            'export var document',
            'export var document = {}',
            'export var document',
            'export default async function() { await 1; }',
            'export default async function async() { await 1; }',
            'export async function async() { await 1; }',
            'export let document = { }',
            'export const document = { }',
            'export class Class {}',
            'export default 42',
            'export default class A {}',
            'export default (class{});',
            'export { a, b }',
            'export { a as default }',
            'export { a, b as dec }',
            'export { default } from "other"',
            'export default function foo() {} false',
           // 'export default /foo/',
            'export var namedOther = null;',
            'export var starAsVarDecl;',
            'export let starAsLetDecl;',
            'export const starAsConstDecl = null;',
            'export function starAsFuncDecl() {}',
            'export function* starAsGenDecl() {}',
            'export class starAsClassDecl {}',
            'export { starAsBindingId };',
            'export { starAsBindingId as starIdName };',
            'export default class Foo {}++x',
            'export { x as y } from \'./y.js\';\nexport { x as z } from \'./z.js\';',
            'export { default as y } from \'./y.js\';\nexport default 42;',
            'export default function(x) {};',
            'export {a as super }',
            'export default function () { };',
            'export default function _fn2 () { }',
            'var a; export default a = 10;',
            'export default () => 3',
            'function _default() { }; export default _default',
            // Named generator function statement
            'function* g() { }; export default g',
            'class c { }; export default c',
            'var _ = { method: function() { return \'method_result\'; }, method2: function() { return \'method2_result\'; } }; export default _',
        ];

        for (const arg of programs) {

            it(`${arg}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
                });
            });
        }

        pass('export * from "foo"', Context.Strict | Context.Module, {
            source: `export * from "foo"`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportAllDeclaration',
                        source: {
                            type: 'Literal',
                            value: 'foo'
                        }
                    }
                ]
            }
        });

        pass('export {}', Context.Strict | Context.Module, {
            source: `export {}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x}', Context.Strict | Context.Module, {
            source: `export {x}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'x'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x as a}', Context.Strict | Context.Module, {
            source: `export {x as a}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'a'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x,}', Context.Strict | Context.Module, {
            source: `export {x,}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'x'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x} from "foo"', Context.Strict | Context.Module, {
            source: `export {x} from "foo"`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: {
                            type: 'Literal',
                            value: 'foo'
                        },
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'x'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x as a} from "foo"', Context.Strict | Context.Module, {
            source: `export {x as a} from "foo"`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: {
                            type: 'Literal',
                            value: 'foo'
                        },
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'a'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x,} from "foo"', Context.Strict | Context.Module, {
            source: `export {x,} from "foo"`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: {
                            type: 'Literal',
                            value: 'foo'
                        },
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'x'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x as a,}', Context.Strict | Context.Module, {
            source: `export {x as a,}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'a'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x, y}', Context.Strict | Context.Module, {
            source: `export {x, y}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'x'
                                }
                            },
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'y'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'y'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x as a, y as b}', Context.Strict | Context.Module, {
            source: `export {x as a, y as b}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'a'
                                }
                            },
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'y'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'b'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x, y,}', Context.Strict | Context.Module, {
            source: `export {x, y,}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'x'
                                }
                            },
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'y'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'y'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export {x as a, y as b,}', Context.Strict | Context.Module, {
            source: `export {x as a, y as b,}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'a'
                                }
                            },
                            {
                                type: 'ExportSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: 'y'
                                },
                                exported: {
                                    type: 'Identifier',
                                    name: 'b'
                                }
                            }
                        ],
                        declaration: null
                    }
                ]
            }
        });

        pass('export var x', Context.Strict | Context.Module, {
            source: `export var x`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'VariableDeclaration',
                            kind: 'var',
                            declarations: [
                                {
                                    type: 'VariableDeclarator',
                                    init: null,
                                    id: {
                                        type: 'Identifier',
                                        name: 'x'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('export var x, y', Context.Strict | Context.Module, {
            source: `export var x, y`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'VariableDeclaration',
                            kind: 'var',
                            declarations: [
                                {
                                    type: 'VariableDeclarator',
                                    init: null,
                                    id: {
                                        type: 'Identifier',
                                        name: 'x'
                                    }
                                },
                                {
                                    type: 'VariableDeclarator',
                                    init: null,
                                    id: {
                                        type: 'Identifier',
                                        name: 'y'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('export var x = 10, y = 20', Context.Strict | Context.Module, {
            source: `export var x = 10, y = 20`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'VariableDeclaration',
                            kind: 'var',
                            declarations: [
                                {
                                    type: 'VariableDeclarator',
                                    init: {
                                        type: 'Literal',
                                        value: 10
                                    },
                                    id: {
                                        type: 'Identifier',
                                        name: 'x'
                                    }
                                },
                                {
                                    type: 'VariableDeclarator',
                                    init: {
                                        type: 'Literal',
                                        value: 20
                                    },
                                    id: {
                                        type: 'Identifier',
                                        name: 'y'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('export let x', Context.Strict | Context.Module, {
            source: `export let x`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'VariableDeclaration',
                            kind: 'let',
                            declarations: [
                                {
                                    type: 'VariableDeclarator',
                                    init: null,
                                    id: {
                                        type: 'Identifier',
                                        name: 'x'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('export let x, y', Context.Strict | Context.Module, {
            source: `export let x, y`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'VariableDeclaration',
                            kind: 'let',
                            declarations: [
                                {
                                    type: 'VariableDeclarator',
                                    init: null,
                                    id: {
                                        type: 'Identifier',
                                        name: 'x'
                                    }
                                },
                                {
                                    type: 'VariableDeclarator',
                                    init: null,
                                    id: {
                                        type: 'Identifier',
                                        name: 'y'
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('export const x', Context.Strict | Context.Module, {
            source: `export const x`,
            expected: {
                  body: [
                    {
                      declaration: {
                        declarations: [
                          {
                            id: {
                              name: 'x',
                              type: 'Identifier',
                            },
                            init: null,
                            type: 'VariableDeclarator'
                          },
                        ],
                        kind: 'const',
                        type: 'VariableDeclaration',
                      },
                      source: null,
                      specifiers: [],
                      type: 'ExportNamedDeclaration',
                    },
                  ],
                  sourceType: 'module',
                  type: 'Program'
                }
        });

        pass('export const x, y', Context.Strict | Context.Module, {
            source: `export const x, y`,
            expected: {
                  body: [
                    {
                      declaration: {
                       declarations: [
                          {
                            id: {
                              name: 'x',
                              type: 'Identifier',
                            },
                            init: null,
                            type: 'VariableDeclarator',
                          },
                          {
                            id: {
                              name: 'y',
                             type: 'Identifier',
                            },
                            init: null,
                            type: 'VariableDeclarator',
                          },
                        ],
                        kind: 'const',
                        type: 'VariableDeclaration',
                      },
                      source: null,
                      specifiers: [],
                      type: 'ExportNamedDeclaration',
                    },
                  ],
                  sourceType: 'module',
                  type: 'Program'
                }
        });

        // Async generator function
        pass('export async function *ariya() {}', Context.Strict | Context.Module, {
            source: `export async function *ariya() {}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'FunctionDeclaration',
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            },
                            async: true,
                            generator: true,
                            expression: false,
                            id: {
                                type: 'Identifier',
                                name: 'ariya'
                            }
                        }
                    }
                ]
            }
        });

        pass('export function f(){}', Context.Strict | Context.Module, {
            source: `export function f(){}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'FunctionDeclaration',
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            },
                            async: false,
                            generator: false,
                            expression: false,
                            id: {
                                type: 'Identifier',
                                name: 'f'
                            }
                        }
                    }
                ]
            }
        });

        pass('export async function f(){}', Context.Strict | Context.Module, {
            source: `export async function f(){}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'FunctionDeclaration',
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            },
                            async: true,
                            generator: false,
                            expression: false,
                            id: {
                                type: 'Identifier',
                                name: 'f'
                            }
                        }
                    }
                ]
            }
        });

        pass('export function* f(){}', Context.Strict | Context.Module, {
            source: `export function* f(){}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'FunctionDeclaration',
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            },
                            async: false,
                            generator: true,
                            expression: false,
                            id: {
                                type: 'Identifier',
                                name: 'f'
                            }
                        }
                    }
                ]
            }
        });

        pass('export default function* f(){}', Context.Strict | Context.Module, {
            source: `export default function* f(){}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportDefaultDeclaration',
                        declaration: {
                            type: 'FunctionDeclaration',
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            },
                            async: false,
                            generator: true,
                            expression: false,
                            id: {
                                type: 'Identifier',
                                name: 'f'
                            }
                        }
                    }
                ]
            }
        });

        pass('export default function(){}', Context.Strict | Context.Module, {
            source: `export default function(){}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportDefaultDeclaration',
                        declaration: {
                            type: 'FunctionDeclaration',
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            },
                            async: false,
                            generator: false,
                            expression: false,
                            id: null
                        }
                    }
                ]
            }
        });

        pass('export class x {}', Context.Strict | Context.Module, {
            source: `export class x {}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportNamedDeclaration',
                        source: null,
                        specifiers: [],
                        declaration: {
                            type: 'ClassDeclaration',
                            id: {
                                type: 'Identifier',
                                name: 'x'
                            },
                            superClass: null,
                            body: {
                                type: 'ClassBody',
                                body: []
                            }
                        }
                    }
                ]
            }
        });

        pass('export default class {}', Context.Strict | Context.Module, {
            source: `export default class {}`,
            expected: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ExportDefaultDeclaration',
                        declaration: {
                            type: 'ClassDeclaration',
                            id: null,
                            superClass: null,
                            body: {
                                type: 'ClassBody',
                                body: []
                            }
                        }
                    }
                ]
            }
        });

     });
});