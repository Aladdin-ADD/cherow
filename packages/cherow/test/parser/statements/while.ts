import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - While', () => {

       pass('while (foo) function () {};', Context.OptionsEditorMode, {
            source: 'while (foo) function () {};',
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
                      "id": null,
                      "params": [],
                      "type": "FunctionDeclaration",
                    },
                    "test": {
                      "name": "foo",
                      "type": "Identifier",
                   },
                    "type": "WhileStatement",
                  },
                  {
                    "type": "EmptyStatement",
                  },
                ],
                "sourceType": "script",
                "type": "Program"
              }
       });
});
