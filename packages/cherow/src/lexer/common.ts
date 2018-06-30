import { State } from '../types';
import { Chars } from '../chars';

export function consume(state: State, code: number): boolean {
  if (state.source.charCodeAt(state.index) !== code) return false;
  state.index++;
  state.column++;
  return true;
}

export function nextChar(state: State): number {
  ++state.column;
  return state.nextChar = state.source.charCodeAt(++state.index);
}

export function nextUnicodeChar(state: State): number {
  let { index } = state;
  const hi = state.source.charCodeAt(index++);

  if (hi < 0xD800 || hi > 0xDBFF) return hi;
  if (index === state.source.length) return hi;
  const lo = state.source.charCodeAt(index);

  if (lo < 0xDC00 || lo > 0xDFFF) return hi;
  return (hi & 0x3FF) << 10 | lo & 0x3FF | 0x10000;
}

export function toHex(code: number): number {
  if (code < Chars.Zero) return -1;
  if (code <= Chars.Nine) return code - Chars.Zero;
  if (code < Chars.UpperA) return -1;
  if (code <= Chars.UpperF) return code - Chars.UpperA + 10;
  if (code < Chars.LowerA) return -1;
  if (code <= Chars.LowerF) return code - Chars.LowerA + 10;
  return -1;
}
