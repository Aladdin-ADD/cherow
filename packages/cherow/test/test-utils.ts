import * as t from 'assert';
import { parseSource } from '../src/parser/parser';
import { Context } from '../src/common';
import * as ESTree from '../src/estree';

export interface Opts {
    source: string;
    expected?: any;
    line ?: number;
    column ?: number;
}

export const pass = (name: string, context: Context, opts: Opts, errCallback?: any) => {
    it(name, () => {
        const parser = parseSource(opts.source, undefined, context, errCallback);
        t.deepEqual(parser, opts.expected);
    });
};

export const fail = (name: string, context: Context, opts: Opts, errCallback?: any) => {
    it(name, () => {
        t.throws(() => {
            parseSource(opts.source, undefined, context, errCallback);
        });
    });
};
