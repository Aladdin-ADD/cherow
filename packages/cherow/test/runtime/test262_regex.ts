import * as t from 'assert';
import { verifyRegExpPattern } from '../../src/lexer/regexp';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { RegexpState } from '../../src/runtime/common';

function isSyntaxCharacter(c: string): boolean {
  switch (c) {
      case "^":
      case "$":
      case "\\":
      case ".":
      case "*":
      case "+":
      case "?":
      case "(":
      case ")":
      case "[":
      case "]":
      case "{":
      case "}":
      case "|":
          return true;
      default:
          return false;
  }
}
function isAlphaDigit(c: any): any {
  return ("0" <= c && c <= "9") || ("A" <= c && c <= "Z") || ("a" <= c && c <= "z");
}

describe('Lexer - Regeular expressions', () => {
  for (var cu = 0x00; cu <= 0x7f; ++cu) {
    const s = String.fromCharCode(cu);
    if (!isAlphaDigit(s) && !isSyntaxCharacter(s) && s !== "/") {
        it(`scans '[\\c${s}]/u'`, () => {
            const parser = createParserObject(`[\\c${s}]/u`, undefined, undefined, undefined);
            const { state } = verifyRegExpPattern(parser, Context.OptionsEditorMode);

            t.deepEqual({
                state,
            }, {
                state: RegexpState.Invalid,
            });
        });
    }

}


});
