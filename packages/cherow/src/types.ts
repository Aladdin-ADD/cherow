
import { Token } from './token';
import { Flags, LabelState } from './common';

/**
 * Error callback
 */
export type ErrorCallBack = (error: string, line: number, column: number) => void;

/**
 * The parser options.
 */
export interface Options {
    // The flag to allow module code
    module?: boolean;

    // Create a top-level comments array containing all comments
    comments?: boolean;

    // The flag to enable stage 3 support (ESNext)
    next?: boolean;

    // The flag to enable start and end offsets to each node
    ranges?: boolean;

    // The flag to enable line/column location information to each node
    loc?: boolean;

    // The flag to enable React JSX parsing
    jsx?: boolean;

    // The flag to attach raw property to each literal node
    raw?: boolean;

    // Attach raw property to each identifier node
    rawIdentifier?: boolean;

    // Set to true to record the source file in every node's loc object when the loc option is set.
    source?: string;

    // The flag to enable implied strict mode
    impliedStrict?: boolean;

    // The flag to allow return in the global scope
    globalReturn?: boolean;

    // The flag to allow experimental features
    experimental?: boolean;

     // The flag to allow to skip shebang - '#'
    skipShebang?: boolean;

    // Enable editor mode
    edit?: boolean;

    // Enables method that should be bypassed when running on NodeJS
    node?: boolean;

    // Enabled tokenizing
    tokenize?: boolean;
    // Enable web compat
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
    labelSetStack: {[key: string]: boolean}[];
    iterationStack: (boolean | LabelState)[];
    switchStatement: LabelState;
    iterationStatement: LabelState;
    labelDepth: number;
    tokenRegExp: void | {
        pattern: string;
        flags: string;
    };
}
