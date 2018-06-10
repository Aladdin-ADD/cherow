import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Switch', () => {

       pass('switch (A) {default: B;}', Context.Empty, {
            source: 'switch (A) {default: B;}',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "SwitchStatement",
                        "discriminant": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "cases": [
                            {
                                "type": "SwitchCase",
                                "test": null,
                                "consequent": [
                                    {
                                        "type": "ExpressionStatement",
                                        "expression": {
                                            "type": "Identifier",
                                            "name": "B"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
        pass('switch (A) {case B: C; default: D;}', Context.Empty, {
            source: 'switch (A) {case B: C; default: D;}',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "SwitchStatement",
                        "discriminant": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "cases": [
                            {
                                "type": "SwitchCase",
                                "test": {
                                    "type": "Identifier",
                                    "name": "B"
                                },
                                "consequent": [
                                    {
                                        "type": "ExpressionStatement",
                                        "expression": {
                                            "type": "Identifier",
                                            "name": "C"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "SwitchCase",
                                "test": null,
                                "consequent": [
                                    {
                                        "type": "ExpressionStatement",
                                        "expression": {
                                            "type": "Identifier",
                                            "name": "D"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });

        pass('switch (A) {case B: C; case D: E;}', Context.Empty, {
            source: 'switch (A) {case B: C; case D: E;}',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "SwitchStatement",
                        "discriminant": {
                            "type": "Identifier",
                            "name": "A"
                        },
                        "cases": [
                            {
                                "type": "SwitchCase",
                                "test": {
                                    "type": "Identifier",
                                    "name": "B"
                                },
                                "consequent": [
                                    {
                                        "type": "ExpressionStatement",
                                        "expression": {
                                            "type": "Identifier",
                                            "name": "C"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "SwitchCase",
                                "test": {
                                    "type": "Identifier",
                                    "name": "D"
                                },
                                "consequent": [
                                    {
                                        "type": "ExpressionStatement",
                                        "expression": {
                                            "type": "Identifier",
                                            "name": "E"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
});