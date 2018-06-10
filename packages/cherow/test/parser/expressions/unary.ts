import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Unary', () => {

        pass('-a', Context.Empty, {
            source: `-a`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "UnaryExpression",
                            "operator": "-",
                            "argument": {
                                "type": "Identifier",
                                "name": "a"
                            },
                            "prefix": true
                        }
                    }
                ]
            } 
        });

        pass('++a', Context.Empty, {
            source: `++a`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "UpdateExpression",
                            "argument": {
                                "type": "Identifier",
                                "name": "a"
                            },
                            "operator": "++",
                            "prefix": true
                        }
                    }
                ]
            }
        });

        pass('if (a) ++a;', Context.Empty, {
            source: `if (a) ++a;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "IfStatement",
                        "test": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "consequent": {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "UpdateExpression",
                                "argument": {
                                    "type": "Identifier",
                                    "name": "a"
                                },
                                "operator": "++",
                                "prefix": true
                            }
                        },
                        "alternate": null
                    }
                ]
            }
        });

        pass('let x = () => ++\na;', Context.Empty, {
            source: `let x = () => ++\na;`,
            expected: {
                  "body": [
                    {
                      "declarations": [
                        {
                          "id": {
                            "name": "x",
                            "type": "Identifier",
                          },
                          "init": {
                            "async": false,
                            "body": {
                              "argument": {
                                "name": "a",
                                "type": "Identifier",
                              },
                              "operator": "++",
                              "prefix": true,
                              "type": "UpdateExpression",
                            },
                            "expression": true,
                            "generator": false,
                            "id": null,
                            "params": [],
                            "type": "ArrowFunctionExpression",
                          },
                          "type": "VariableDeclarator",
                        },
                      ],
                      "kind": "let",
                      "type": "VariableDeclaration",
                    },
                  ],
                  "sourceType": "script",
                  "type": "Program"
                }
        });

        pass('if (a++);', Context.Empty, {
            source: `if (a++);`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "IfStatement",
                        "test": {
                            "type": "UpdateExpression",
                            "argument": {
                                "type": "Identifier",
                                "name": "a"
                            },
                            "operator": "++",
                            "prefix": false
                        },
                        "consequent": {
                            "type": "EmptyStatement"
                        },
                        "alternate": null
                    }
                ]
            }
        });

        pass('a--', Context.Empty, {
            source: `a--`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "UpdateExpression",
                            "argument": {
                                "type": "Identifier",
                                "name": "a"
                            },
                            "operator": "--",
                            "prefix": false
                        }
                    }
                ]
            }
        });

        pass('if (a) a--;', Context.Empty, {
            source: `if (a) a--;`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "IfStatement",
                        "test": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "consequent": {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "UpdateExpression",
                                "argument": {
                                    "type": "Identifier",
                                    "name": "a"
                                },
                                "operator": "--",
                                "prefix": false
                            }
                        },
                        "alternate": null
                    }
                ]
            }
        });

        pass('a=b\n++c', Context.Empty, {
            source: `a=b\n++c`,
            expected: {
                  "body": [
                    {
                      "expression": {
                        "left": {
                          "name": "a",
                          "type": "Identifier",
                        },
                        "operator": "=",
                        "right": {
                          "name": "b",
                          "type": "Identifier",
                        },
                        "type": "AssignmentExpression"
                      },
                      "type": "ExpressionStatement"
                    },
                    {
                      "expression": {
                        "argument": {
                          "name": "c",
                          "type": "Identifier",
                        },
                        "operator": "++",
                        "prefix": true,
                        "type": "UpdateExpression",
                      },
                     "type": "ExpressionStatement"
                    }
                  ],
                  "sourceType": "script",
                  "type": "Program"
                }
        });
    });