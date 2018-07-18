import * as t from 'assert';
import { parseModule, parseScript, parse } from '../../../src//cherow';

describe('Cherow - API', () => {

  it('should parse script code with "parse"', () => {
      t.deepEqual(parse('foo'), {
          body: [{
              expression: {
                  name: 'foo',
                  type: 'Identifier'
              },
              type: 'ExpressionStatement'
          }, ],
          sourceType: 'script',
          type: 'Program'
      });
  });

  it('should parse module code', () => {
      t.deepEqual(parseModule('foo'), {
          body: [{
              expression: {
                  name: 'foo',
                  type: 'Identifier'
              },
              type: 'ExpressionStatement'
          }, ],
          sourceType: 'module',
          type: 'Program'
      });
  });

  it('should parse with impliedStrict and shebang option', () => {
      t.deepEqual(parseScript('foo', {
          impliedStrict: true,
          skipShebang: true
      }), {
          body: [{
              expression: {
                  name: 'foo',
                  type: 'Identifier'
              },
              type: 'ExpressionStatement'
          }, ],
          sourceType: 'script',
          type: 'Program'
      });
  });

 /* it('should parse with rawIdentifier option', () => {
      t.deepEqual(parseModule('foo', {
          rawIdentifier: true
      }) as any, {
          body: [{
              expression: {
                  name: 'foo',
                  type: 'Identifier',
                  raw: 'foo'
              },
              type: 'ExpressionStatement'
          }, ],
          sourceType: 'module',
          type: 'Program'
      });
  });*/

  it('should parse with raw option - number', () => {
      t.deepEqual(parseModule('1', {
          raw: true
      }) as any, {
          body: [{
              expression: {
                  raw: '1',
                  type: 'Literal',
                  value: 1,
              },
              type: 'ExpressionStatement'
          }, ],
          sourceType: 'module',
          type: 'Program'
      });
  });

  it('should parse with raw option - string', () => {
      t.deepEqual(parseModule('"a"', {
          raw: true
      }) as any, {
          body: [{
              directive: 'a',
              expression: {
                  raw: '"a"',
                  type: 'Literal',
                  value: 'a',
              },
              type: 'ExpressionStatement'
          }, ],
          sourceType: 'module',
          type: 'Program',
      });
  });

  it('should parse with globalReturn option', () => {
      t.deepEqual(parseModule('return', {
          globalReturn: true,
          next: true
      }) as any, {
          body: [{
              argument: null,
              type: 'ReturnStatement',
          }, ],
          sourceType: 'module',
          type: 'Program'
      });
  });

  it('should parse with loc option', () => {
      t.deepEqual(parseModule('1', {
          loc: true,
          node: true
      }) as any, {
          body: [{
              expression: {
                  loc: {
                      end: {
                          column: 1,
                          line: 1,
                      },
                      start: {
                          column: 0,
                          line: 1,
                      }
                  },
                  type: 'Literal',
                  raw: null,
                  value: 1,
              },
              loc: {
                  end: {
                      column: 1,
                      line: 1,
                  },
                  start: {
                      column: 0,
                      line: 1,
                  },
              },
              type: 'ExpressionStatement'
          }, ],
          loc: {
              end: {
                  column: 1,
                  line: 1,
              },
              start: {
                  column: 0,
                  line: 1
              },
          },
          sourceType: 'module',
          type: 'Program'
      });
  });

  it('should parse with ranges option', () => {
      t.deepEqual(parseModule('1', {
          ranges: true
      }) as any, {
          body: [{
              end: 1,
              expression: {
                  end: 1,
                  start: 0,
                  type: 'Literal',
                  raw: null,
                  value: 1,
              },
              start: 0,
              type: 'ExpressionStatement',
          }, ],
          end: 1,
          sourceType: 'module',
          start: 0,
          type: 'Program',
      });
  });
});
