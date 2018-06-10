import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Binary', () => {

    pass('-(x ** y)', Context.Empty, {
        source: '-(x ** y)',
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
                            "type": "BinaryExpression",
                            "left": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "right": {
                                "type": "Identifier",
                                "name": "y"
                            },
                            "operator": "**"
                        },
                        "prefix": true
                    }
                }
            ]
        }
    });  

    pass('1+2;', Context.Empty, {
        source: '1+2;',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
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
                    }
                }
            ]
        }
    });  

    pass('x & y', Context.Empty, {
        source: 'x & y',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "BinaryExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "y"
                        },
                        "operator": "&"
                    }
                }
            ]
        }
    });  

    pass('x - y + z', Context.Empty, {
        source: 'x - y + z',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
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
                            "operator": "-"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "z"
                        },
                        "operator": "+"
                    }
                }
            ]
        }
    });  

    pass('x - y % z', Context.Empty, {
        source: 'x - y % z',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
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
                            "operator": "%"
                        },
                        "operator": "-"
                    }
                }
            ]
        }
    });  
});