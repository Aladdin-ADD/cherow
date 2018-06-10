import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Try', () => {

    pass('try {} finally {}', Context.Empty, {
        source: 'try {} finally {}',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "TryStatement",
                    "block": {
                        "type": "BlockStatement",
                        "body": []
                    },
                    "handler": null,
                    "finalizer": {
                        "type": "BlockStatement",
                        "body": []
                    }
                }
            ]
        }
    });  

    pass('try {} catch(e) {} finally {}', Context.Empty, {
        source: 'try {} catch(e) {} finally {}',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "TryStatement",
                    "block": {
                        "type": "BlockStatement",
                        "body": []
                    },
                    "handler": {
                        "type": "CatchClause",
                        "param": {
                            "type": "Identifier",
                            "name": "e"
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        }
                    },
                    "finalizer": {
                        "type": "BlockStatement",
                        "body": []
                    }
                }
            ]
        }
    });  

    pass('try {} catch(){}', Context.OptionsEditorMode, {
        source: 'try {} catch(){}',
        expected: {
              "body": [
                {
                  "block": {
                    "body": [],
                    "type": "BlockStatement",
                  },
                  "finalizer": null,
                  "handler": {
                    "body": {
                      "body": [],
                      "type": "BlockStatement",
                    },
                    "param": undefined,
                    "type": "CatchClause",
                  },
                  "type": "TryStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program",
            }
    }, function(errMsg: string) {
        t.equal(errMsg, 'Missing catch clause');
    });  

    pass('try {} catch(e){}', Context.Empty, {
        source: 'try {} catch(e){}',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "TryStatement",
                    "block": {
                        "type": "BlockStatement",
                        "body": []
                    },
                    "handler": {
                        "type": "CatchClause",
                        "param": {
                            "type": "Identifier",
                            "name": "e"
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        }
                    },
                    "finalizer": null
                }
            ]
        }
    });  
/*
    pass('try {} catch(e, f){}', Context.Empty, {
        source: 'try {} catch(e, f){}',
        expected: {
              "body": [
                {
                  "block": {
                    "body": [],
                    "type": "BlockStatement",
                  },
                  "finalizer": null,
                  "handler": {
                    "body": {
                      "body": [
                       {
                          "expression": undefined,
                          "type": "ExpressionStatement",
                        },
                        {
                          "expression": {
                            "name": "f",
                            "type": "Identifier",
                          },
                          "type": "ExpressionStatement",
                        },
                        {
                          "expression": undefined,
                          "type": "ExpressionStatement",
                        },
                        {
                          "expression": undefined,
                          "type": "ExpressionStatement",
                        },
                      ],
                      "type": "BlockStatement",
                    },
                    "param": {
                      "name": "e",
                      "type": "Identifier",
                    },
                    "type": "CatchClause",
                  },
                  "type": "TryStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program"
            }
    }, function(errMsg: string) {
        //t.equal(errMsg, 'Unexpected token ,');
    });   */

    pass('try {} catch({e}){}', Context.Empty, {
        source: 'try {} catch({e}){}',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "TryStatement",
                    "block": {
                        "type": "BlockStatement",
                        "body": []
                    },
                    "handler": {
                        "type": "CatchClause",
                        "param": {
                            "type": "ObjectPattern",
                            "properties": [
                                {
                                    "type": "Property",
                                    "kind": "init",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "e"
                                    },
                                    "computed": false,
                                    "value": {
                                        "type": "Identifier",
                                        "name": "e"
                                    },
                                    "method": false,
                                    "shorthand": true
                                }
                            ]
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        }
                    },
                    "finalizer": null
                }
            ]
        }
    });  

    pass('try {} catch([e]){}', Context.Empty, {
        source: 'try {} catch([e]){}',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "TryStatement",
                    "block": {
                        "type": "BlockStatement",
                        "body": []
                    },
                    "handler": {
                        "type": "CatchClause",
                        "param": {
                            "type": "ArrayPattern",
                            "elements": [
                                {
                                    "type": "Identifier",
                                    "name": "e"
                                }
                            ]
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        }
                    },
                    "finalizer": null
                }
            ]
        }
    });  
/*
    pass('try {} catch({e}=x){}', Context.Empty, {
        source: 'try {} catch({e}=x){}',
        expected: {
              "body": [
              {
                  "block": {
                    "body": [],
                    "type": "BlockStatement",
                  },
                 "finalizer": null,
                  "handler": {
                    "body": {
                      "body": [
                        {
                          "expression": undefined,
                          "type": "ExpressionStatement"
                        },
                        {
                          "expression": {
                            "name": "x",
                            "type": "Identifier",
                          },
                          "type": "ExpressionStatement",
                        },
                        {
                          "expression": undefined,
                         "type": "ExpressionStatement"
                        },
                        {
                          "expression": undefined,
                          "type": "ExpressionStatement",
                        },
                      ],
                      "type": "BlockStatement",
                   },
                    "param": {
                      "properties": [
                        {
                          "computed": false,
                          "key": {
                           "name": "e",
                            "type": "Identifier",
                          },
                          "kind": "init",
                          "method": false,
                          "shorthand": true,
                          "type": "Property",
                          "value": {
                            "name": "e",
                            "type": "Identifier",
                          }
                        }
                      ],
                      "type": "ObjectPattern"
                    },
                    "type": "CatchClause"
                  },
                  "type": "TryStatement"
                }
              ],
              "sourceType": "script",
              "type": "Program"
            }
    }, function() {
        // Multiple error messages 
        // 1 - Catch clause parameter does not support default values
        // 2 - Unexpected token =
    });   
*/
    pass('try {} catch({e=x}){}', Context.Empty, {
        source: 'try {} catch({e=x}){}',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "TryStatement",
                    "block": {
                        "type": "BlockStatement",
                        "body": []
                    },
                    "handler": {
                        "type": "CatchClause",
                        "param": {
                            "type": "ObjectPattern",
                            "properties": [
                                {
                                    "type": "Property",
                                    "kind": "init",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "e"
                                    },
                                    "computed": false,
                                    "value": {
                                        "type": "AssignmentPattern",
                                        "left": {
                                            "type": "Identifier",
                                            "name": "e"
                                        },
                                        "right": {
                                            "type": "Identifier",
                                            "name": "x"
                                        }
                                    },
                                    "method": false,
                                    "shorthand": true
                                }
                            ]
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        }
                    },
                    "finalizer": null
                }
            ]
        }
    });  

    pass('try {} catch([e=x]){}', Context.Empty, {
        source: 'try {} catch([e=x]){}',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "TryStatement",
                    "block": {
                        "type": "BlockStatement",
                        "body": []
                    },
                    "handler": {
                        "type": "CatchClause",
                        "param": {
                            "type": "ArrayPattern",
                            "elements": [
                                {
                                    "type": "AssignmentPattern",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "e"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "x"
                                    }
                                }
                            ]
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        }
                    },
                    "finalizer": null
                }
            ]
        }
    });  

    pass('try {} catch(e) {}', Context.Empty, {
    source: 'try {} catch(e) {}',
    expected: {
        "type": "Program",
        "sourceType": "script",
        "body": [
            {
                "type": "TryStatement",
                "block": {
                    "type": "BlockStatement",
                    "body": []
                },
                "handler": {
                    "type": "CatchClause",
                    "param": {
                        "type": "Identifier",
                        "name": "e"
                    },
                    "body": {
                        "type": "BlockStatement",
                        "body": []
                    }
                },
                "finalizer": null
            }
        ]
    },
});
});