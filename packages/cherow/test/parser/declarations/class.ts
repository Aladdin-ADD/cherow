import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Miscellaneous - Class', () => {

    describe('Pass', () => {

        
        pass('a = { a: b }', Context.OptionsNext, {
            source: `a = { a: b }`,
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
                                "name": "a"
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

        pass('class A {; ;; ;}', Context.OptionsNext | Context.Module, {
            source: `class A {; ;; ;}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": []
                        }
                    }
                ]
            }
        });

        pass('class A extends B {}', Context.OptionsNext | Context.Module, {
            source: `class A extends B {}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": {
                            "type": "Identifier",
                            "name": "B"
                        },
                        "body": {
                            "type": "ClassBody",
                            "body": []
                        }
                    }
                ]
            }
        });

        pass('class A extends foo() {}', Context.OptionsNext | Context.Module, {
            source: `class A extends foo() {}`,
            expected:{
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": {
                            "type": "CallExpression",
                            "callee": {
                                "type": "Identifier",
                                "name": "foo"
                            },
                            "arguments": []
                        },
                        "body": {
                            "type": "ClassBody",
                            "body": []
                        }
                    }
                ]
            }
        });

        pass('class A {a(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {a(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": false,
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {static a(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {static a(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": true,
                                    "computed": false,
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });
/*
        pass('class A {constructor(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {constructor(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "constructor"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });*/

        pass('class A { static async foo(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {static async foo(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": true,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });
        pass('class A {async foo(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {async foo(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {*foo(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {*foo(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {get foo(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {get foo(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "get",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {get set(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {get set(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "get",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "set"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {static get foo(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {static get foo(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "get",
                                    "static": true,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {set foo(x){}}', Context.OptionsNext | Context.Module, {
            source: `class A {set foo(x){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "set",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {set(){} get(){} async(){}}', Context.OptionsNext | Context.Module, {
            source: `class A {set(){} get(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "module",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "set"
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
                                    }
                                },
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "get"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {[a](){}}', Context.OptionsNext, {
            source: `class A {[a](){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": true,
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {*[foo](){}}', Context.OptionsNext, {
            source: `class A {*[foo](){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": true,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {get [foo](){}}', Context.OptionsNext, {
            source: `class A {get [foo](){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "get",
                                    "static": false,
                                    "computed": true,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });
      
        pass('class A {static get [foo](){}}', Context.OptionsNext, {
            source: `class A {static get [foo](){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "get",
                                    "static": true,
                                    "computed": true,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {set [foo](x){}}}', Context.OptionsNext, {
            source: `class A {set [foo](x){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "set",
                                    "static": false,
                                    "computed": true,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {async(){}}', Context.OptionsNext, {
            source: `class A { async(){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": false,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "async"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {async [foo](){}}', Context.OptionsNext, {
            source: `class A { async *[foo](){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": true,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {async [foo](){}}', Context.OptionsNext, {
            source: `class A {async [foo](){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": false,
                                    "computed": true,
                                    "key": {
                                        "type": "Identifier",
                                        "name": "foo"
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        pass('class A {static [a](){}}', Context.OptionsNext, {
            source: `class A {static [a](){}}`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ClassDeclaration",
                        "id": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "superClass": null,
                        "body": {
                            "type": "ClassBody",
                            "body": [
                                {
                                    "type": "MethodDefinition",
                                    "kind": "method",
                                    "static": true,
                                    "computed": true,
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
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });
   
        pass('class A {async(){}}', Context.OptionsNext, {
            source: `class A {async get foo(){}}`,
            expected: {
                  "body": [
                    {
                      "body": {
                        "body": [
                          {
                            "computed": false,
                            "key": {
                              "name": "get",
                              "type": "Identifier",
                           },
                            "kind": "method",
                            "static": false,
                            "type": "MethodDefinition",
                            "value": undefined,
                          },
                          {
                            "computed": false,
                            "key": {
                              "name": "foo",
                              "type": "Identifier",
                            },
                            "kind": "method",
                            "static": false,
                            "type": "MethodDefinition",
                            "value": {
                             "async": false,
                              "body": {
                                "body": [],
                                "type": "BlockStatement",
                              },
                              "expression": false,
                              "generator": false,
                              "id": null,
                              "params": [],
                              "type": "FunctionExpression",
                           },
                          },
                        ],
                        "type": "ClassBody"
                      },
                      "id": {
                        "name": "A",
                        "type": "Identifier",
                      },
                      "superClass": null,
                      "type": "ClassDeclaration"
                    }
                 ],
                  "sourceType": "script",
                  "type": "Program"
                }
        });
 });
});