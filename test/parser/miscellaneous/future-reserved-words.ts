import { pass, fail } from '../../test-utils';
import { Context } from '../../../src/utilities';
import * as t from 'assert';
import { parse } from '../../../src/parser/parser';

describe('Miscellaneous - Future reserved words', () => {

    describe('Failure', () => {

        const invalidStrictSyntax = [
            'var package = 1;',
            'var private = 1;',
            'var yield = 1;',
            'var interface = 1;',
        ];

        for (const arg of invalidStrictSyntax) {

            it(`"use strict"; ${arg}`, () => {
                t.throws(() => {
                    parse(`"use strict"; ${arg}`, undefined, Context.Empty);
                });
            });

            it(`${arg}`, () => {
                t.throws(() => {
                    parse(`${arg}`, undefined, Context.Strict | Context.Module);
                });
            });
        }

        const invalidSyntax = [
            'var class = 1;',
            'var const = 1;',
            'var debugger = 1;',
            'var export = 1;',
            'var import = 1;',
            'var class = 1;',
            'var super = 1;',
            'var class = 1;',
            'var class = 1;',

        ];

        for (const arg of invalidSyntax) {

            it(`${arg}`, () => {
                t.throws(() => {
                    parse(`${arg}`, undefined, Context.Empty);
                });
            });
        }
    });
});