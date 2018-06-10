import { Token } from './token';
import { Flags, LabelState } from './common';
import { Comment } from './estree';
/**
 * `ECMAScript version
 */
export declare type EcmaVersion = 1 | 2 | 3 | 4 | 5 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020;
/**
 * `onToken` option.
 */
export declare type OnToken = void | ((token: string, value: string, line?: number, column?: number) => void);
/**
 * `onError` option.
 */
export declare type OnError = void | ((error: string, line: number, column: number) => void);
/**
 * `onComment` option.
 */
export declare type OnComment = void | Comment[] | ((type: string, value: string, start: number, end: number) => any);
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
    edit?: OnError;
    node?: boolean;
    tokenize?: boolean;
    webcompat?: boolean;
    onComment?: OnComment;
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
    onError?: OnError;
    onComment?: OnComment;
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
