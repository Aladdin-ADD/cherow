import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Statements - With', () => {

    const validSyntax = [
        `with({}){ p1 = 'x1'; }`,
        `if (false) {
    //      with ({}) let // ASI
    //    {}
      }`
    ];
  
    for (const arg of validSyntax) {
        it(`${arg}`, () => {
            t.doesNotThrow(() => {
                parseSource(`${arg}`, undefined, Context.Empty);
            });
        });
    }

    pass('with (foo) bar;', Context.Empty, {
        source: 'with (foo) bar;',
        expected: {
            "type": "Program",
            "sourceType": "script",
            "body": [
                {
                    "type": "WithStatement",
                    "object": {
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

    // Note: This only get parsed in 'editor mode'
    pass('with (foo) function bar() {}', Context.OptionsEditorMode, {
        source: 'with (foo) function bar() {}',
        expected: {
              "body": [
               {
                  "body": {
                    "async": false,
                    "body": {
                      "body": [],
                      "type": "BlockStatement",
                    },
                    "expression": false,
                    "generator": false,
                    "id": {
                      "name": "bar",
                      "type": "Identifier",
                    },
                    "params": [],
                    "type": "FunctionDeclaration",
                  },
                  "object": {
                    "name": "foo",
                    "type": "Identifier",
                  },
                  "type": "WithStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program"
            }
    });
});
