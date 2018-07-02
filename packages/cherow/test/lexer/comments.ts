import * as t from 'assert';
import { nextToken } from '../../src/lexer/scan';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

// https://github.com/tc39/test262/tree/master/test/language/comments

describe('Lexer - Comments', () => {

    function pass(name: string, opts: any) {
        it(name, () => {
            const parser = createParserObject(opts.source, undefined, undefined, undefined);
            const token = nextToken(parser, Context.Empty);
            t.deepEqual({
                index: parser.index,
                line: parser.line,
                column: parser.column,
            }, {
                line: opts.line,
                index: opts.index,
                column: opts.column
            }, );
        });
    }

    function fail(name: string, context: Context, opts: any): any {
      it(name, () => {
          const parser = createParserObject(opts.source, undefined, undefined, undefined);
          t.throws(() => {
              nextToken(parser, context)
          });
      });
  }

  fail('should fail "/* "', Context.Empty, {
    source: '/* '
})


fail('should fail "/* "', Context.Module, {
  source: `<!--the comment extends to these characters`
})

pass('should handle slash in a comment', {
  source: `// /`,
  line: 1, column: 4, index: 4
});

pass('should handle slash in a comment', {
  source: `// \u2028\u2028`,
  line: 3, column: 0, index: 5
});


pass('should handle slash in a comment', {
  source: `// \r`,
  line: 2, column: 0, index: 4
});

pass('should handle slash in a comment', {
  source: `// \r\n`,
  line: 3, column: 0, index: 5
});

pass('should handle slash in a comment', {
  source: `// \\n\\r`,
  line: 1, column: 7, index: 7
});

pass('should handle slash in a comment', {
  source: `// \\r\\n\\u2028`,
  line: 1, column: 13, index: 13
});

pass('should handle Esprima issue #1828', {
  source: `ident /* multiline
  comment */ -->`,
  line: 1, column: 5, index: 5
});

pass('should handle slash in a comment', {
  source: `// \u2028\u2028`,
  line: 3, column: 0, index: 5
});

pass('should handle slash in a comment', {
  source: `// */`,
  line: 1, column: 5, index: 5
});

pass('single line comment escaped newlines are ignored', {
  source: `//\\n \\r \\x0a \\u000a still comment`,
  line: 1, column: 33, index: 33
});

    pass('should handle correct interpretation of single line comments', {
        source: `//FOO
        ///`,
        line: 2, column: 11, index: 17
    });

    pass('should handle correct interpretation of single line comments', {
      source: `/* var
      //x
      */`,
      line: 3, column: 8, index: 25
    });

    pass('should insert Single line comment into Multi line comment', {
        source: `/* var
        //x
        */`,
        line: 3, column: 10, index: 29
    });

    pass('should handle fist multi line comment, then Single line comment', {
        source: `/*CHECK#1*/

        /* var
        *///x*/`,
        line: 4, column: 15, index: 43
    });

    pass('single and Multi line comments are used together', {
      source: `// var /* x */`,
      line: 1, column: 14, index: 14
  });

  pass('multi line comment can contain FORM FEED (U+000C)', {
    source: `/*\\u000C multi line \\u000C comment \\u000C*/`,
    line: 1, column: 43, index: 43
  });

  pass('multi line comment can contain SPACE (U+0020)', {
    source: `/*\\u0020 multi line \\u0020 comment \\u0020*/`,
    line: 1, column: 43, index: 43
  });

  pass('multi line comment can contain NO-BREAK SPACE (U+00A0)', {
    source: `/*\\u00A0 multi line \\u00A0 comment \\u00A0*/`,
    line: 1, column: 43, index: 43
  });

  pass('multi line comment can contain NO-BREAK SPACE (U+00A0)', {
    source: `/*
    */-->the comment extends to these characters`,
    line: 2, column: 48, index: 51
  });

  pass('multi line comment can contain NO-BREAK SPACE (U+00A0)', {
    source: `/*
    optional
    MultiLineCommentChars */-->the comment extends to these characters`,
    line: 3, column: 70, index: 86
  });

  pass('optional SingleLineDelimitedCommentSequence', {
    source: `/*
    */ /* optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters`,
    line: 2, column: 98, index: 101
  });

  pass('optional SingleLineDelimitedCommentSequence', {
    source: `-->the comment extends to these characters`,
    line: 1, column:  42, index: 42
  });

  pass('<!--the comment extends to these characters', {
    source: `<!--the comment extends to these characters`,
    line: 1, column:  43, index: 43
  });

  pass('optional SingleLineDelimitedCommentSequence', {
    source: `-->the comment extends to these characters`,
    line: 1, column:  42, index: 42
  });


  pass('multi line comment ignore escape', {
    source: '/* \\u{nope} \\unope \\xno */',
    line: 1, column:  26, index: 26
  });

  pass('ignores escaped newline', {
    source: '/* \\n \\r \\x0a \\u000a */',
    line: 1, column:  23, index: 23
  });

  pass('multi line comment ignore escape', {
    source: '/* \\u{nope} \\unope \\xno */',
    line: 1, column:  26, index: 26
  });


});
