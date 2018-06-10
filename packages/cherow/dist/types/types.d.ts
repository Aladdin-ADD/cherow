import { Token } from './token';
import { Flags, LabelState } from './common';
/**
 * Error callback
 */
export declare type ErrorCallBack = (error: string, line: number, column: number) => void;
/**
 * The parser options.
 */
export interface Options {
    module?: boolean;
    comments?: boolean;
    next?: boolean;
    ranges?: boolean;
    loc?: boolean;
    jsx?: boolean;
    raw?: boolean;
    rawIdentifier?: boolean;
    source?: string;
    impliedStrict?: boolean;
    globalReturn?: boolean;
    experimental?: boolean;
    skipShebang?: boolean;
    edit?: boolean;
    node?: boolean;
    tokenize?: boolean;
    webcompat?: boolean;
}
export interface Parser {
    source: string;
    length: number;
    flags: Flags;
    startIndex: number;
    lastIndex: number;
    index: number;
    line: number;
    startLine: number;
    lastLine: number;
    column: number;
    startColumn: number;
    lastColumn: number;
    token: Token;
    tokenValue: any;
    tokenRaw: string;
    tokens: Token[];
    onError?: ErrorCallBack;
    functionBoundaryStack: any;
    labelSet: any;
    capturingParens: number;
    largestBackReference: number;
    labelSetStack: {
        [key: string]: boolean;
    }[];
    iterationStack: (boolean | LabelState)[];
    switchStatement: LabelState;
    iterationStatement: LabelState;
    labelDepth: number;
    tokenRegExp: void | {
        pattern: string;
        flags: string;
    };
}
