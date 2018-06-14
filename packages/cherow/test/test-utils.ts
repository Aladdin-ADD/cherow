import * as t from 'assert';
import { parseSource } from '../src/parser/parser';
import { Context } from '../src/common';

export interface Opts {
    source: string;
    expected?: any;
    line ?: number;
    column ?: number;
}

export const pass = (name: string, context: Context, opts: Opts) => {
    it(name, () => {
        const parser = parseSource(opts.source, undefined, context);
        t.deepEqual(parser, opts.expected);
    });
};

export const fail = (name: string, context: Context, opts: Opts) => {
    it(name, () => {
        t.throws(() => {
            parseSource(opts.source, undefined, context);
        });
    });
};
