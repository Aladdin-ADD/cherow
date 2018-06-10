import * as t from 'assert';
import { nextToken } from '../../src/lexer/scan';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

// https://github.com/tc39/test262/tree/master/test/language/white-space

describe('Lexer - Whitespace', () => {

    function pass(name: string, opts: any) {
        it(name, () => {
            const parser = createParserObject(opts.source, undefined);
            const token = nextToken(parser, Context.Empty);
            t.deepEqual({
                line: parser.line,
                column: parser.column,
            }, {
                line: opts.line,
                column: opts.column
            }, );
        });
    }

    pass('should skip nothing', {
        source: '',
        line: 1, column: 0,
    });

    pass('should skip single line comments with form feed', {
        source: '//\u000C single line \u000C comment \u000C',
        line: 1, column: 27,
    });

    pass('should skip multiline comment with horizontal tab', {
        source: '/*	multi\tline\tcomment*/',
        line: 1, column: 23,
    });

    pass('should skip multiline comment with space', {
        source: '/*\u0020 multi line \u0020 comment \u0020*/',
        line: 1, column: 28,
    });

    pass('should skip multiline comment with no break space', {
        source: '/*\u00A0 multi line \u00A0 comment \u00A0*/',
        line: 1, column: 28,
    });

    pass('should skip multiline comment with form feed', {
        source: '/*multilinecomment*/',
        line: 1, column: 24,
    });
    pass('should multiline comment with line feed and single line comment', {
        source: '/*\n*/--> a comment',
        line: 2, column: 15,
    });

    pass('should skip spaces', {
        source: '        ',
        line: 1, column: 8,
    });

    pass('should skip tabs', {
        source: '\t\t\t\t\t\t\t\t',
        line: 1, column: 8,
    });

    pass('should skip vertical tabs', {
        source: '\v\v\v\v\v\v\v\v',
        line: 1, column: 8,
    });

    pass('should skip mixed whitespace', {
        source: '    \t \r\n \n\r \v\f\t ',
        line: 4, column: 5,
    });

    pass('should skip multiline comments with nothing', {
        source: '  \t /* foo * /* bar */  ',
        line: 1, column: 24,
    });


    pass('should skip multiline comments with nothing', {
        source: `  \t // foo bar\n  `,
        line: 2, column: 2,
    });

    pass('should skip multiline comments with nothing', {
        source: `  \t // foo bar\r  `,
        line: 2, column: 2,
    });

    pass('should skip multiline comments with nothing', {
        source: '  \t /* foo * /* bar */  ',
        line: 1, column: 24,
    });

    pass('should skip multiline comments with line feed', {
        source: `  \t /* foo * /* bar \n */  `,
        line: 2, column: 5,
    });

    // Annex B

    pass('should skip HTML single line comments with line feed', {
        source: `  \t <!-- foo bar\n  `,
        line: 2, column: 2,
    });

    pass('should skip multiple HTML single line comments with line feed', {
        source: `  \t <!-- foo bar\n <!-- baz \n <!--`,
        line: 3, column: 5,
    });

    pass('should skip single HTML close comment after line feed', {
        source: `  \t \n -->  `,
        line: 2, column: 6,
    });
});
