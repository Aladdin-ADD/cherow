import * as t from 'assert';
import { scanPrivateName } from '../../src/lexer/common';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
describe('Lexer - Private name', () => {

  function pass(name: string, opts: any) {
      it(name, () => {
          const parser = createParserObject(opts.source, undefined, undefined, undefined);
          const token = scanPrivateName(parser, Context.InClass);
          t.deepEqual({
              line: parser.line,
              column: parser.column,
              index: parser.index,
          }, {
              line: opts.line,
              column: opts.column,
              index: opts.index
          }, );
      });
  }

  function fail(name: string, context: Context, opts: any) {
      it(name, () => {
          const parser = createParserObject(opts.source, undefined, undefined, undefined);
          t.throws(() => {
              scanPrivateName(parser, context)
          });
      });
  }

  fail('should fail on private name followed by space', Context.InClass, {
      source: '# a'
  })

  fail('should fail on private name with multiple space', Context.InClass, {
      source: '#    a'
  })

  fail('should fail on private name with digits', Context.InClass, {
      source: '#123'
  })

  fail('should fail on private name with underscore', Context.InClass, {
      source: '#_a'
  })

  pass('should accept private name followed by identifier', {
      source: '#a',
      line: 1,
      column: 0,
      index: 0
  });

  pass('should accept private name followed by identifier', {
      source: '#abc',
      line: 1,
      column: 0,
      index: 0
  });
});
