import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - For Of', () => {

    describe('Statements - Pass', () => {

        pass('for (a of b);', Context.Empty, {
            source: 'for (a of b);',
            expected: {
                "type": "Program",
                "sourceType": "script",
                "body": [
                    {
                        "type": "ForOfStatement",
                        "body": {
                            "type": "EmptyStatement"
                        },
                        "left": {
                            "type": "Identifier",
                            "name": "a"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "b"
                        },
                        "await": false
                    }
                ]
            }
        });
    });
});
