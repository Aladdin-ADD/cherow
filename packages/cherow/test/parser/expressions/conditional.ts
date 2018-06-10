import * as t from 'assert';
import { pass } from '../../test-utils';
import { Context } from '../../../src/common';
import { parseSource } from '../../../src/parser/parser';

describe('Expressions - Conditional', () => {

    describe('Pass', () => {

        const validSyntax = [
            '(y ? y : true)',
            'true ? y : false',
            '"1" ? "" : "1"',
            '"1" ? y : ""',
            'y ? y : "1"',
            'true ? y : z',
            '(false ? true : undefined)',
            '("1" ? "" : "1")',
            '("1" ? y : "")',
            'Symbol() ? 1 : 2, 1',
            '(false ? false : true)',
        ];
      
        for (const arg of validSyntax) {
      
            it(`${arg}`, () => {
                t.doesNotThrow(() => {
                    parseSource(`${arg}`, undefined, Context.Empty);
                });
            });
      
            it(`${arg}`, () => {
              t.doesNotThrow(() => {
                  parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
              });
          });
        }
      
    });
});