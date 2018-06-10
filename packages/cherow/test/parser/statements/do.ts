import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';

describe('Statements - Do while', () => {

    pass('do foo; while (bar);', Context.Empty, {
        source: 'do foo; while (bar);',
        expected: {
              "body": [
                {
                  "body": {
                    "expression": {
                      "name": "foo",
                      "type": "Identifier",
                   },
                    "type": "ExpressionStatement",
                  },
                  "test": {
                    "name": "bar",
                    "type": "Identifier",
                  },
                  "type": "DoWhileStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program",
            }
    });

    // Note: This only get parsed in 'editor mode'
    pass('do foo; while (bar);', Context.OptionsEditorMode, {
        source: 'do function foo() {} while (bar);',
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
                      "name": "foo",
                      "type": "Identifier",
                    },
                    "params": [],
                    "type": "FunctionDeclaration",
                  },
                  "test": {
                    "name": "bar",
                    "type": "Identifier",
                  },
                  "type": "DoWhileStatement",
                },
              ],
              "sourceType": "script",
              "type": "Program"
            }
    });

});
