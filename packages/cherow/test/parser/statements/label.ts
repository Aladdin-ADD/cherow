import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Label', () => {

    describe('Failure', () => {
        
    });
    
    // Only allowed in sloppy mode (AnnexB)
    pass('label: function() {}', Context.Empty, {
        source: 'label: function a() {}',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "LabeledStatement",
                    "label": {
                        "type": "Identifier",
                        "name": "label"
                    },
                    "body": {
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
                            "name": "a"
                        }
                    }
                }
            ]
        }       
    });
    
    pass('foo: bar;', Context.Empty, {
        source: 'foo: bar;',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "LabeledStatement",
                    "label": {
                        "type": "Identifier",
                        "name": "foo"
                    },
                    "body": {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "Identifier",
                            "name": "bar"
                        }
                    }
                }
            ]
        }
    });
});
