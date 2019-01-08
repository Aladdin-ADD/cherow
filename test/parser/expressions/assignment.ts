import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Expressions - Assignment', () => {});

pass('Expressions - Assignment (pass)', [
  [
    'x <<= 42',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'Identifier',
              name: 'x'
            },
            operator: '<<=',
            right: {
              type: 'Literal',
              value: 42
            }
          }
        }
      ]
    }
  ],
  [
    'x &= 42',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'Identifier',
              name: 'x'
            },
            operator: '&=',
            right: {
              type: 'Literal',
              value: 42
            }
          }
        }
      ]
    }
  ],
  [
    'x /= 42',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'Identifier',
              name: 'x'
            },
            operator: '/=',
            right: {
              type: 'Literal',
              value: 42
            }
          }
        }
      ]
    }
  ],
  [
    'x >>>= 42',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'Identifier',
              name: 'x'
            },
            operator: '>>>=',
            right: {
              type: 'Literal',
              value: 42
            }
          }
        }
      ]
    }
  ],
  [
    'x |= 42',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'Identifier',
              name: 'x'
            },
            operator: '|=',
            right: {
              type: 'Literal',
              value: 42
            }
          }
        }
      ]
    }
  ],
  [
    'a=1',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'Identifier',
              name: 'a'
            },
            operator: '=',
            right: {
              type: 'Literal',
              value: 1
            }
          }
        }
      ]
    }
  ],
  [
    'x.x *= 1',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'x'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'x'
              }
            },
            operator: '*=',
            right: {
              type: 'Literal',
              value: 1
            }
          }
        }
      ]
    }
  ],
  [
    'x **= 1',
    Context.Empty,
    {
      type: 'Program',
      sourceType: 'script',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            left: {
              type: 'Identifier',
              name: 'x'
            },
            operator: '**=',
            right: {
              type: 'Literal',
              value: 1
            }
          }
        }
      ]
    }
  ]
]);
