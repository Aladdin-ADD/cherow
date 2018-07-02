import * as t from 'assert';
import { nextToken } from '../../src/lexer/scan';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

// https://github.com/tc39/test262/tree/master/test/language/white-space

describe('Lexer - Whitespace', () => {

    function pass(name: string, opts: any) {
        it(name, () => {
            const parser = createParserObject(opts.source, undefined, undefined, undefined);
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

    pass('should skip carriage return and new line', {
      source: '\r\n',
      line: 2, column: 0,
    });

    pass('should skip single line comments with carriage return', {
      source: `  \t // foo ba\n  `,
      line: 2, column: 2,
    });

    pass('should skip single line comments with line feed', {
      source: `  \t // foo ba\r  `,
      line: 2, column: 2,
    });

    pass('should skip single line comments with paragrap separator', {
      source: `  \t // foo ba\u2028  `,
      line: 2, column: 2,
    });

    pass('should skip multiline comments with paragraph separator', {
      source: `  \t /* foo * /* bar \u2028 */  `,
      line: 2, column: 5,
    });

    pass('should skip multiline comments with line separator', {
      source: `  \t /* foo * /* bar \u2028 */  `,
      line: 2, column: 5,
    });

    pass('should skip multiline comments with line feed', {
      source: `  \t /* foo * /* bar \n */  `,
      line: 2, column: 5,
    });

    pass('should skip multiline comments with line feed', {
      source: `  \t /* foo * /* bar \r */  `,
      line: 2, column: 5,
    });

    pass('should skip multiline comments with line feed', {
      source: `  \t /* foo bar\r *//* baz*/ \r /**/`,
      line: 3, column: 5,
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

    pass('should skip multiline comment with no mathematical space', {
      source: '/*\u00A0 multi line \0x205F comment \0x205F*/',
      line: 1, column: 38,
    });

    pass('should skip block HTML close with chars w/o line terminator', {
      source: "  \t /**/  --> the comment doesn't extend to these characters\n ",
      line: 1, column: 12,
    });

    pass("avoids single HTML close comment w/o line terminator", {
      source: "  \t -->  ",
      line: 1, column: 6,
    });

    pass("avoids single HTML close comment w/o line terminator", {
      source: `  \t /*\toptional\tMultiLineCommentChars \t*/  --> ` +
      `the comment extends to these characters\t `,
      line: 1, column: 45,
    });

    pass("avoids first line block HTML close w/o line terminator", {
      source: "  \t /* optional FirstCommentLine */  --> " +
          "the comment doesn't extend to these characters\n ",
      line: 1, column: 39,
    });

    pass("avoids 2 single-line block on line of HTML close w/o line terminator", {
      source: "  \t /**/ /* second optional SingleLineDelimitedCommentSequence */ " +
          "   --> the comment doesn't extend to these characters\n ",
      line: 1, column: 71,
  });

    pass("avoids 2 single block + HTML close w/o line terminator", {
      source: "  \t /**/ /* optional second SingleLineDelimitedCommentSequence */" +
          "  --> the comment doesn't extend to these characters\n ",
      line: 1, column: 69,
  });

    pass('should skip multiline comment with form feed', {
        source: '/*multilinecomment*/',
        line: 1, column: 24,
    });
    pass('should multiline comment with line feed and single line comment', {
        source: '/*\n*/--> a comment',
        line: 1, column:15,
    });

    pass('should skip spaces', {
        source: '        ',
        line: 1, column: 8,
    });

    pass('should skip narrow no break space', {
      source: ' \u202F       ',
      line: 1, column: 9,
    });

    pass('should skip hair space', {
      source: ' \u200A       ',
      line: 1, column: 9,
    });

    pass('should skip ideographic space', {
      source: ' \u205F       ',
      line: 1, column: 9,
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

    pass('should skip paragraph separators', {
      source: '    \t \u2029 ',
      line: 2, column: 1,
  });

    pass('should skip line separators', {
      source: '    \t \u2028 ',
      line: 2, column: 1,
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

    pass('should skip single HTML close comment after line feed', {
      source: ` /* a\r\nb */`,
      line: 2, column: 4,
  });


});
