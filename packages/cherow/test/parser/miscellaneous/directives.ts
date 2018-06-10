import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Miscellaneous - Directives', () => {

    describe('Pass', () => {

        pass('"foo" "bar"', Context.Empty, {
            source: `"use asm;"`,
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "Literal",
                            "value": "use asm;"
                        },
                        "directive": "use asm;"
                    }
                ]
            }
           
        },  () => {
           // t.equal(msg, 'Illegal break statement');
        });
    });
});