import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Miscellaneous - Precedence', () => {

pass(`var a, b, c, d, e, f, g, x, y, z;
a = 1 + 2 * 3 / 5;
b = (1 + 2) * 3 / 5;
c = (1 + 2) * (3 - 5);
d = x | y ^ z;
e = (x | y) ^ z;
f = "a" + (1 + 2) + "b";
g = "a" + (1 - 2) + "b";
a = true || false && null;
b = c == d || e != f;
c = x instanceof y || x instanceof z;
d = x == y && y != z;
a = !false;
b = !x instanceof Number;
c = !(x instanceof Number);
d = typeof a === 'boolean';
e = !typeof a === 'boolean';
f = !(typeof a === 'boolean');
a = (1.1).toString();
b = new A().toString();
c = new x.A().toString();
d = new x.y().z();
var r = (/ab+c/i).exec('abc');
a = b ** 2 * 3;
c = (d ** 2) ** 3;
e = f ** 2 ** 3;
f = a + (b = 3);
g = 1 && (() => {});
g = (() => {}) && 1;`, Context.Empty, {
  source: `var a, b, c, d, e, f, g, x, y, z;
  a = 1 + 2 * 3 / 5;
  b = (1 + 2) * 3 / 5;
  c = (1 + 2) * (3 - 5);
  d = x | y ^ z;
  e = (x | y) ^ z;
  f = "a" + (1 + 2) + "b";
  g = "a" + (1 - 2) + "b";
  a = true || false && null;
  b = c == d || e != f;
  c = x instanceof y || x instanceof z;
  d = x == y && y != z;
  a = !false;
  b = !x instanceof Number;
  c = !(x instanceof Number);
  d = typeof a === 'boolean';
  e = !typeof a === 'boolean';
  f = !(typeof a === 'boolean');
  a = (1.1).toString();
  b = new A().toString();
  c = new x.A().toString();
  d = new x.y().z();
  var r = (/ab+c/i).exec('abc');
  a = b ** 2 * 3;
  c = (d ** 2) ** 3;
  e = f ** 2 ** 3;
  f = a + (b = 3);
  g = 1 && (() => {});
  g = (() => {}) && 1;`,
  expected: {
    "type": "Program",
    "sourceType": "script",
    "body": [
        {
            "type": "VariableDeclaration",
            "kind": "var",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "a"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "b"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "c"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "d"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "e"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "f"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "g"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "x"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "y"
                    }
                },
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "z"
                    }
                }
            ]
        },
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
                    "type": "BinaryExpression",
                    "left": {
                        "type": "Literal",
                        "value": 1
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "Literal",
                                "value": 2
                            },
                            "right": {
                                "type": "Literal",
                                "value": 3
                            },
                            "operator": "*"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 5
                        },
                        "operator": "/"
                    },
                    "operator": "+"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "b"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "Literal",
                                "value": 1
                            },
                            "right": {
                                "type": "Literal",
                                "value": 2
                            },
                            "operator": "+"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 3
                        },
                        "operator": "*"
                    },
                    "right": {
                        "type": "Literal",
                        "value": 5
                    },
                    "operator": "/"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "c"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Literal",
                            "value": 1
                        },
                        "right": {
                            "type": "Literal",
                            "value": 2
                        },
                        "operator": "+"
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Literal",
                            "value": 3
                        },
                        "right": {
                            "type": "Literal",
                            "value": 5
                        },
                        "operator": "-"
                    },
                    "operator": "*"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "d"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "Identifier",
                        "name": "x"
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "y"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "z"
                        },
                        "operator": "^"
                    },
                    "operator": "|"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "e"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "y"
                        },
                        "operator": "|"
                    },
                    "right": {
                        "type": "Identifier",
                        "name": "z"
                    },
                    "operator": "^"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "f"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Literal",
                            "value": "a"
                        },
                        "right": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "Literal",
                                "value": 1
                            },
                            "right": {
                                "type": "Literal",
                                "value": 2
                            },
                            "operator": "+"
                        },
                        "operator": "+"
                    },
                    "right": {
                        "type": "Literal",
                        "value": "b"
                    },
                    "operator": "+"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "g"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Literal",
                            "value": "a"
                        },
                        "right": {
                            "type": "BinaryExpression",
                            "left": {
                                "type": "Literal",
                                "value": 1
                            },
                            "right": {
                                "type": "Literal",
                                "value": 2
                            },
                            "operator": "-"
                        },
                        "operator": "+"
                    },
                    "right": {
                        "type": "Literal",
                        "value": "b"
                    },
                    "operator": "+"
                }
            }
        },
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
                    "type": "LogicalExpression",
                    "left": {
                        "type": "Literal",
                        "value": true
                    },
                    "right": {
                        "type": "LogicalExpression",
                        "left": {
                            "type": "Literal",
                            "value": false
                        },
                        "right": {
                            "type": "Literal",
                            "value": null
                        },
                        "operator": "&&"
                    },
                    "operator": "||"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "b"
                },
                "operator": "=",
                "right": {
                    "type": "LogicalExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "c"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "d"
                        },
                        "operator": "=="
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "e"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "f"
                        },
                        "operator": "!="
                    },
                    "operator": "||"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "c"
                },
                "operator": "=",
                "right": {
                    "type": "LogicalExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "y"
                        },
                        "operator": "instanceof"
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "z"
                        },
                        "operator": "instanceof"
                    },
                    "operator": "||"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "d"
                },
                "operator": "=",
                "right": {
                    "type": "LogicalExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "y"
                        },
                        "operator": "=="
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "y"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "z"
                        },
                        "operator": "!="
                    },
                    "operator": "&&"
                }
            }
        },
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
                    "type": "UnaryExpression",
                    "operator": "!",
                    "argument": {
                        "type": "Literal",
                        "value": false
                    },
                    "prefix": true
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "b"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "UnaryExpression",
                        "operator": "!",
                        "argument": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "prefix": true
                    },
                    "right": {
                        "type": "Identifier",
                        "name": "Number"
                    },
                    "operator": "instanceof"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "c"
                },
                "operator": "=",
                "right": {
                    "type": "UnaryExpression",
                    "operator": "!",
                    "argument": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "Number"
                        },
                        "operator": "instanceof"
                    },
                    "prefix": true
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "d"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "UnaryExpression",
                        "operator": "typeof",
                        "argument": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "prefix": true
                    },
                    "right": {
                        "type": "Literal",
                        "value": "boolean"
                    },
                    "operator": "==="
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "e"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "UnaryExpression",
                        "operator": "!",
                        "argument": {
                            "type": "UnaryExpression",
                            "operator": "typeof",
                            "argument": {
                                "type": "Identifier",
                                "name": "a"
                            },
                            "prefix": true
                        },
                        "prefix": true
                    },
                    "right": {
                        "type": "Literal",
                        "value": "boolean"
                    },
                    "operator": "==="
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "f"
                },
                "operator": "=",
                "right": {
                    "type": "UnaryExpression",
                    "operator": "!",
                    "argument": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "UnaryExpression",
                            "operator": "typeof",
                            "argument": {
                                "type": "Identifier",
                                "name": "a"
                            },
                            "prefix": true
                        },
                        "right": {
                            "type": "Literal",
                            "value": "boolean"
                        },
                        "operator": "==="
                    },
                    "prefix": true
                }
            }
        },
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
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "Literal",
                            "value": 1.1
                        },
                        "computed": false,
                        "property": {
                            "type": "Identifier",
                            "name": "toString"
                        }
                    },
                    "arguments": []
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "b"
                },
                "operator": "=",
                "right": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "NewExpression",
                            "callee": {
                                "type": "Identifier",
                                "name": "A"
                            },
                            "arguments": []
                        },
                        "computed": false,
                        "property": {
                            "type": "Identifier",
                            "name": "toString"
                        }
                    },
                    "arguments": []
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "c"
                },
                "operator": "=",
                "right": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "NewExpression",
                            "callee": {
                                "type": "MemberExpression",
                                "object": {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                "computed": false,
                                "property": {
                                    "type": "Identifier",
                                    "name": "A"
                                }
                            },
                            "arguments": []
                        },
                        "computed": false,
                        "property": {
                            "type": "Identifier",
                            "name": "toString"
                        }
                    },
                    "arguments": []
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "d"
                },
                "operator": "=",
                "right": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "NewExpression",
                            "callee": {
                                "type": "MemberExpression",
                                "object": {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                "computed": false,
                                "property": {
                                    "type": "Identifier",
                                    "name": "y"
                                }
                            },
                            "arguments": []
                        },
                        "computed": false,
                        "property": {
                            "type": "Identifier",
                            "name": "z"
                        }
                    },
                    "arguments": []
                }
            }
        },
        {
            "type": "VariableDeclaration",
            "kind": "var",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "init": {
                        "type": "CallExpression",
                        "callee": {
                            "type": "MemberExpression",
                            "object": {
                                "type": "Literal",
                                "value": {},
                                "regex": {
                                    "pattern": "ab+c",
                                    "flags": "i"
                                }
                            },
                            "computed": false,
                            "property": {
                                "type": "Identifier",
                                "name": "exec"
                            }
                        },
                        "arguments": [
                            {
                                "type": "Literal",
                                "value": "abc"
                            }
                        ]
                    },
                    "id": {
                        "type": "Identifier",
                        "name": "r"
                    }
                }
            ]
        },
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
                    "type": "BinaryExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 2
                        },
                        "operator": "**"
                    },
                    "right": {
                        "type": "Literal",
                        "value": 3
                    },
                    "operator": "*"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "c"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "d"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 2
                        },
                        "operator": "**"
                    },
                    "right": {
                        "type": "Literal",
                        "value": 3
                    },
                    "operator": "**"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "e"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
                    "left": {
                        "type": "Identifier",
                        "name": "f"
                    },
                    "right": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Literal",
                            "value": 2
                        },
                        "right": {
                            "type": "Literal",
                            "value": 3
                        },
                        "operator": "**"
                    },
                    "operator": "**"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "f"
                },
                "operator": "=",
                "right": {
                    "type": "BinaryExpression",
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
                            "type": "Literal",
                            "value": 3
                        }
                    },
                    "operator": "+"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "g"
                },
                "operator": "=",
                "right": {
                    "type": "LogicalExpression",
                    "left": {
                        "type": "Literal",
                        "value": 1
                    },
                    "right": {
                        "type": "ArrowFunctionExpression",
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "params": [],
                        "id": null,
                        "async": false,
                        "generator": false,
                        "expression": false
                    },
                    "operator": "&&"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "left": {
                    "type": "Identifier",
                    "name": "g"
                },
                "operator": "=",
                "right": {
                    "type": "LogicalExpression",
                    "left": {
                        "type": "ArrowFunctionExpression",
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "params": [],
                        "id": null,
                        "async": false,
                        "generator": false,
                        "expression": false
                    },
                    "right": {
                        "type": "Literal",
                        "value": 1
                    },
                    "operator": "&&"
                }
            }
        }
    ]
}
});
});
