import * as t from 'assert';
import { validateRegExp } from '../../src/cherow';

describe('Charow API', () => {

    describe('Regular expression validation', () => {

        it('Esprima is not a valid regular expression', () => {
            t.throws(() => {
                validateRegExp('esprima', undefined);
            });
        });

        it('should throw if missing slash at the start', () => {
            t.throws(() => {
                validateRegExp('a/', undefined);
            });
        });

        it('should validate regular expression successfully', () => {
            t.doesNotThrow(() => {
                validateRegExp('/a/', undefined);
            });
        });

        it('should throw on invalid unicode regular expression', () => {
            t.throws(() => {
                validateRegExp('/\\03b/u', undefined);
            });
        });

        it('should validate a complex regular expression successfully', () => {
            t.doesNotThrow(() => {
                validateRegExp('/^^^^^^^robot$$$$/u', undefined);
            });
        });
    });
});
