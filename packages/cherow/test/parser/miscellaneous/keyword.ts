import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Miscellaneous - Escaped identifiers', () => {

  describe('Failure', () => {
    const programs = [
      'break = 1;',
      'continue = 1;',
      'function = 1;',
      'void = 1;',
      'with = 1;',
      'var = 1;',
      'class',
      'if',
      'continue',
      'for',
      'switch',
      'while = 1;',
      'try = 1;'
  ];

  for (const arg of programs) {

      it(`${arg}`, () => {
          t.throws(() => {
              parseSource(`${arg}`, undefined, Context.Empty);
          });
      });

      it(`var ${arg}`, () => {
          t.throws(() => {
              parseSource(`var ${arg}`, undefined, Context.Empty);
          });
      });

      it(`function () { ${arg} }`, () => {
          t.throws(() => {
              parseSource(`function () { ${arg} }`, undefined, Context.Empty);
          });
      });
  }
  });

  describe('Pass', () => {
    pass(`var foo = {}; foo.if;`, Context.Empty, {
      source: 'var foo = {}; foo.if;',
      expected: {
        "type": "Program",
        "sourceType": "script",
        "body": [
            {
                "type": "VariableDeclaration",
                "kind": "var",
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "ObjectExpression",
                            "properties": []
                        },
                        "id": {
                            "type": "Identifier",
                            "name": "foo"
                        }
                    }
                ]
            },
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "MemberExpression",
                    "object": {
                        "type": "Identifier",
                        "name": "foo"
                    },
                    "computed": false,
                    "property": {
                        "type": "Identifier",
                        "name": "if"
                    }
                }
            }
        ]
    }
    });

    pass(`var foo = {}; foo.super;`, Context.Empty, {
      source: 'var foo = {}; foo.super;',
      expected: {
        "type": "Program",
        "sourceType": "script",
        "body": [
            {
                "type": "VariableDeclaration",
                "kind": "var",
                "declarations": [
                    {
                        "type": "VariableDeclarator",
                        "init": {
                            "type": "ObjectExpression",
                            "properties": []
                        },
                        "id": {
                            "type": "Identifier",
                            "name": "foo"
                        }
                    }
                ]
            },
            {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "MemberExpression",
                    "object": {
                        "type": "Identifier",
                        "name": "foo"
                    },
                    "computed": false,
                    "property": {
                        "type": "Identifier",
                        "name": "super"
                    }
                }
            }
        ]
    }
    });

    pass(`function *a(){({yi\\u0065ld: 0})}`, Context.OptionsRanges | Context.OptionsNext, {
      source: 'function *a(){({yi\\u0065ld: 0})}',
      expected: {
          body: [{
              async: false,
              body: {
                  body: [{
                      end: 31,
                      expression: {
                          end: 30,
                          properties: [{
                              computed: false,
                              end: 29,
                              key: {
                                  end: 26,
                                  name: 'yield',
                                  start: 16,
                                  type: 'Identifier',
                              },
                              kind: 'init',
                              method: false,
                              shorthand: false,
                              start: 16,
                              type: 'Property',
                              value: {
                                  end: 29,
                                  start: 28,
                                  type: 'Literal',
                                  value: 0,
                              }
                          }],
                          start: 15,
                          type: 'ObjectExpression',
                      },
                      start: 14,
                      type: 'ExpressionStatement'
                  }, ],
                  end: 32,
                  start: 13,
                  type: 'BlockStatement'
              },
              end: 32,
              expression: false,
              generator: true,
              id: {
                  end: 11,
                  name: 'a',
                  start: 10,
                  type: 'Identifier'
              },
              params: [],
              start: 0,
              type: 'FunctionDeclaration'
          }],
          end: 32,
          sourceType: 'script',
          start: 0,
          type: 'Program'
      }
  });
  });
});
