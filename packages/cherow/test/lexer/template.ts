import * as t from 'assert';
import { nextToken } from '../../src/lexer/scan';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

// See test/parser/literals/string.ts

describe('Lexer - Template', () => {

  function pass(name: string, opts: any) {
    function test(name: string, context: Context) {
        it(name, () => {
            if (opts.strict !== true) {
                const parser = createParserObject(opts.source, undefined, undefined, undefined);
                t.deepEqual({
                    token: nextToken(parser, context),
                    value: parser.tokenValue,
                    line: parser.line,
                    column: parser.column,
                }, {
                    token: 67108870,
                    value: opts.value,
                    line: opts.line,
                    column: opts.column,
                });
            }
        });
    }
    test(`${name}`, Context.OptionsRaw);
}

function fail(name: string, context: Context, opts: any): any {
  it(name, () => {
      const parser = createParserObject(opts.source, undefined, undefined, undefined);
      t.throws(() => {
          nextToken(parser, context)
      });
  });
}

fail('should fail "Λ\r\nλ"', Context.Empty, {
source: '"Λ\r\nλ"'
})

fail('should fail "Λ\r\nλ"', Context.Empty, {
  source: '"Λ\r\nλ"'
  })

pass("scans '``", {
  source: "``",
  value: "",
  raw: "''",
  line: 1, column: 2,
});

pass("scans '`abc`", {
  source: "`abc`",
  "value": "abc",
  raw: "''",
  line: 1, column: 5,
});
});
