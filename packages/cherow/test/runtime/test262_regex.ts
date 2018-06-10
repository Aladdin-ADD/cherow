import * as t from 'assert';
import { verifyRegExpPattern } from '../../src/lexer/regexp';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { RegexpState } from '../../src/lexer/common';


function isValidAlphaEscapeInAtom(s: any): any {
  switch (s) {
      // ClassEscape[U] :: b
      case "b":
          // ControlEscape :: one of f n r t v
      case "f":
      case "n":
      case "r":
      case "t":
      case "v":
          // CharacterClassEscape :: one of d D s S w W
      case "d":
      case "D":
      case "s":
      case "S":
      case "w":
      case "W":
          return true;
      default:
          return false;
  }
}

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

function isAlpha(c: any) {
  return ("A" <= c && c <= "Z") || ("a" <= c && c <= "z");
}
describe('Lexer - Regeular expressions - Test262 tests', () => {

  for (var cu = 0x00; cu <= 0x7f; ++cu) {
    const s = String.fromCharCode(cu);
    if (!isAlphaDigit(s) && !isSyntaxCharacter(s) && s !== "/") {
        it(`scans '[\\c${s}]/u'`, () => {
            const parser = createParserObject(`[\\c${s}]/u`, undefined);
            const { state } = verifyRegExpPattern(parser, Context.OptionsEditorMode);

            t.deepEqual({
                state,
            }, {
                state: RegexpState.Invalid,
            });
        });
    }

    for (cu = 0x61 /* a */ ; cu <= 0x7a /* z */ ; ++cu) {
      const s = String.fromCharCode(cu);
      if (!isValidAlphaEscapeInAtom(s)) {
          it(`scans '[\\c${s}]/u'`, () => {
              const parser = createParserObject(`[\\c${s}]/u`, undefined);
              const { state } = verifyRegExpPattern(parser, Context.OptionsEditorMode);
              t.deepEqual({
                  state,
              }, {
                  state: RegexpState.Valid,
              });
          });
      }

  }
}


});
