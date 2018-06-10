import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Expressions - Unary', () => {

        pass('a + b + c', Context.Empty, {
            source: `a + b + c`,
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
                                    "name": "a"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "b"
                                },
                                "operator": "+"
                            },
                            "right": {
                                "type": "Identifier",
                                "name": "c"
                            },
                            "operator": "+"
                        }
                    }
                ]
            }
        });

        pass('a * b + c * d', Context.Empty, {
            source: `a * b + c * d`,
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
                                    "name": "a"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "b"
                                },
                                "operator": "*"
                            },
                            "right": {
                                "type": "BinaryExpression",
                                "left": {
                                    "type": "Identifier",
                                    "name": "c"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "d"
                                },
                                "operator": "*"
                            },
                            "operator": "+"
                        }
                    }
                ]
            }
        });

        pass('a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n', Context.Empty, {
            source: `a=b+=c-=d**=e*=f/=g%=h<<=i>>=j>>>=k&=l^=m|=n`,
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
                                "type": "AssignmentExpression",
                                "left": {
                                    "type": "Identifier",
                                    "name": "b"
                                },
                                "operator": "+=",
                                "right": {
                                    "type": "AssignmentExpression",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "c"
                                    },
                                    "operator": "-=",
                                    "right": {
                                        "type": "AssignmentExpression",
                                        "left": {
                                            "type": "Identifier",
                                            "name": "d"
                                        },
                                        "operator": "**=",
                                        "right": {
                                            "type": "AssignmentExpression",
                                            "left": {
                                                "type": "Identifier",
                                                "name": "e"
                                            },
                                            "operator": "*=",
                                            "right": {
                                                "type": "AssignmentExpression",
                                                "left": {
                                                    "type": "Identifier",
                                                    "name": "f"
                                                },
                                                "operator": "/=",
                                                "right": {
                                                    "type": "AssignmentExpression",
                                                    "left": {
                                                        "type": "Identifier",
                                                        "name": "g"
                                                    },
                                                    "operator": "%=",
                                                    "right": {
                                                        "type": "AssignmentExpression",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "h"
                                                        },
                                                        "operator": "<<=",
                                                        "right": {
                                                            "type": "AssignmentExpression",
                                                            "left": {
                                                                "type": "Identifier",
                                                                "name": "i"
                                                            },
                                                            "operator": ">>=",
                                                            "right": {
                                                                "type": "AssignmentExpression",
                                                                "left": {
                                                                    "type": "Identifier",
                                                                    "name": "j"
                                                                },
                                                                "operator": ">>>=",
                                                                "right": {
                                                                    "type": "AssignmentExpression",
                                                                    "left": {
                                                                        "type": "Identifier",
                                                                        "name": "k"
                                                                    },
                                                                    "operator": "&=",
                                                                    "right": {
                                                                        "type": "AssignmentExpression",
                                                                        "left": {
                                                                            "type": "Identifier",
                                                                            "name": "l"
                                                                        },
                                                                        "operator": "^=",
                                                                        "right": {
                                                                            "type": "AssignmentExpression",
                                                                            "left": {
                                                                                "type": "Identifier",
                                                                                "name": "m"
                                                                            },
                                                                            "operator": "|=",
                                                                            "right": {
                                                                                "type": "Identifier",
                                                                                "name": "n"
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        });

});