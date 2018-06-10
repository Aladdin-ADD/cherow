import * as t from 'assert';
import { scan } from '../../src/lexer/scan';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

// https://github.com/tc39/test262/tree/master/test/language/comments

describe('Lexer - Comments', () => {

    function pass(name: string, opts: any) {
        it(name, () => {
            const parser = createParserObject(opts.source, undefined);
            const token = scan(parser, Context.Empty);
            t.deepEqual({
                line: parser.line,
                column: parser.column,
            }, {
                line: opts.line,
                column: opts.column
            }, );
        });
    }

    pass('should handle correct interpretation of single line comments', {
        source: `//FOO
        ///`,
        line: 2, column: 11,
    });

    pass('should insert Single line comment into Multi line comment', {
        source: `/* var
        //x
        */`,
        line: 3, column: 10,
    });

    pass('should handle fist multi line comment, then Single line comment', {
        source: `/*CHECK#1*/

        /* var
        *///x*/`,
        line: 4, column: 15,
    });

});