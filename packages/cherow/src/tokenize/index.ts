import { State } from '../types';

import { Token, KeywordDescTable } from '../token';
import { Context } from '../../src/common';
import { nextToken } from '../../src/lexer/scan';

export function tokenize(state: State) {
  // TODO: make it work, state should be a class?
  const tokens: any[] = [];
  let token = nextToken(state, context);
  tokens.push(token);

  while (token !== Token.EndOfSource) {
    token = nextToken(state, Context.Empty) 
    tokens.push(token);
  }
  return tokens;
}

// TODO! Optimize and refactor this!



function getTokenValue(state: State, t: Token) {

  if (t & Token.Punctuator) return KeywordDescTable[t & Token.Type];

  return state.source.slice(state.startIndex, state.index);

}



function convertTokenType(t: Token): string {

  if (t & Token.Identifier) return 'Identifier';

  if (t & Token.Punctuator) return 'Punctuator';

  if (t & Token.NumericLiteral) return 'Numeric';

  if ((t & Token.StringLiteral) === Token.StringLiteral) return 'String';

  if (t & Token.RegularExpression) return 'Regular Expression';

  if (t & Token.Template) return 'Template';

  if (t & (Token.Reserved | Token.FutureReserved)) return 'Keyword';

  return 'Boolean'; // true / false

}