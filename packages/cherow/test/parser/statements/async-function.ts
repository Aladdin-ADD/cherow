import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Async function', () => {
    pass('async function foo() {}', Context.Empty, {
        source: 'async function foo() {}',
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
                    "async": true,
                    "generator": false,
                    "expression": false,
                    "id": {
                        "type": "Identifier",
                        "name": "foo"
                    }
                }
            ]
        }
    });
});