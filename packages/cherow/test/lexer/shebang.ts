import * as t from 'assert';
import { skipBomAndShebang } from '../../src/lexer/common';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

describe('Lexer - Shebang and BOM', () => {

    function pass(name: string, opts: any) {
        it(name, () => {
            const parser = createParserObject(opts.source, undefined, undefined, undefined);
            const token = skipBomAndShebang(parser, Context.OptionsShebang);
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
    pass('skips a shebang+paragraph separator in an otherwise empty source', {
      source: '#!/foo/bar/baz -abc\u2029',
      line: 2,
      column: 0,
      index: 20
  });
  pass("skips a shebang+paragraph separator before an identifier", {
      source: "#!/foo/bar/baz -abc\u2029foo",
      hasNext: true,
      index: 20,
      line: 2,
      column: 0,
  });

  pass("skips a shebang+paragraph separator before a lone hash", {
      source: "#!/foo/bar/baz -abc\u2029# foo",
      hasNext: true,
      index: 20,
      line: 2,
      column: 0,
  });

  pass("skips a shebang+paragraph separator before a lone exclamation", {
      source: "#!/foo/bar/baz -abc\u2029! foo",
      hasNext: true,
      index: 20,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+LF in an otherwise empty source", {
      source: "\uFFEF#!/foo/bar/baz -abc\n",
      hasNext: false,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+LF before an identifier", {
      source: "\uFFEF#!/foo/bar/baz -abc\nfoo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+LF before a lone hash", {
      source: "\uFFEF#!/foo/bar/baz -abc\n# foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+LF before a lone exclamation", {
      source: "\uFFEF#!/foo/bar/baz -abc\n! foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+CR in an otherwise empty source", {
      source: "\uFFEF#!/foo/bar/baz -abc\r",
      hasNext: false,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+CR before an identifier", {
      source: "\uFFEF#!/foo/bar/baz -abc\rfoo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+CR before a lone hash", {
      source: "\uFFEF#!/foo/bar/baz -abc\r# foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+CR before a lone exclamation", {
      source: "\uFFEF#!/foo/bar/baz -abc\r! foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+CRLF in an otherwise empty source", {
      source: "\uFFEF#!/foo/bar/baz -abc\r\n",
      hasNext: false,
      index: 22,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+CRLF before an identifier", {
      source: "\uFFEF#!/foo/bar/baz -abc\r\nfoo",
      hasNext: true,
      index: 22,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+CRLF before a lone hash", {
      source: "\uFFEF#!/foo/bar/baz -abc\r\n# foo",
      hasNext: true,
      index: 22,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+CRLF before a lone exclamation", {
      source: "\uFFEF#!/foo/bar/baz -abc\r\n! foo",
      hasNext: true,
      index: 22,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+line separator in an otherwise empty source", {
      source: "\uFFEF#!/foo/bar/baz -abc\u2028",
      hasNext: false,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+line separator before an identifier", {
      source: "\uFFEF#!/foo/bar/baz -abc\u2028foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+line separator before a lone hash", {
      source: "\uFFEF#!/foo/bar/baz -abc\u2028# foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+line separator before a lone exclamation", {
      source: "\uFFEF#!/foo/bar/baz -abc\u2028! foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+paragraph separator in an otherwise empty source", {
      source: "\uFFEF#!/foo/bar/baz -abc\u2029",
      hasNext: false,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+paragraph separator before an identifier", {
      source: "\uFFEF#!/foo/bar/baz -abc\u2029foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+paragraph separator before a lone hash", {
      source: "\uFFEF#!/foo/bar/baz -abc\u2029# foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });

  pass("skips a BOM+shebang+paragraph separator before a lone exclamation", {
      source: "\uFFEF#!/foo/bar/baz -abc\u2029! foo",
      hasNext: true,
      index: 21,
      line: 2,
      column: 0,
  });
});
