import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Statements - Const', () => {

    const validSyntax = [
        'const a = Infinity;',
        'const b = -Infinity;',
        'const c = +Infinity;',
        'const c = foo;',
        //'const d = /abc/;',
        //'const e = /abc/g;',
        //'const f = /abc/gi;'
    ];
  
      for (const arg of validSyntax) {
        it(`${arg}`, () => {
            t.doesNotThrow(() => {
                parseSource(`${arg}`, undefined, Context.Empty);
            });
        });
  
        it(`${arg}`, () => {
          t.doesNotThrow(() => {
              parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
          });
      });
    }
});