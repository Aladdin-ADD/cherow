import * as t from 'assert';
import { validateRegExp } from '../../src/cherow';

describe('Charow API', () => {

    describe('Regular expression validation', () => {

        it('Esprima is not a valid regular expression', () => {
            t.throws(() => {
                validateRegExp('esprima');
            });
        });

        it('should throw if missing slash at the start', () => {
            t.throws(() => {
                validateRegExp('a/');
            });
        });

        it('should validate regular expression successfully', () => {
            t.doesNotThrow(() => {
                validateRegExp('/a/');
            });
        });

        it('should throw on invalid unicode regular expression', () => {
            t.throws(() => {
                validateRegExp('/\\03b/u');
            });
        });

        it('should validate a complex regular expression successfully', () => {
            t.doesNotThrow(() => {
                validateRegExp('/^^^^^^^robot$$$$/u');
            });
        });
    });
});
