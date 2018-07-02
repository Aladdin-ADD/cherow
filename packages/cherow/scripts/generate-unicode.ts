#!/usr/bin/env node
'use strict';

import * as path from 'path';
import * as fs from 'fs';

export const enum DataInst {
   Empty = 0x0,
   Many = 0x1,
   Link = 0x2,
}

const UnicodeCodeCount = 0x110000;
const VectorSize = Uint32Array.BYTES_PER_ELEMENT * 8;
const VectorMask = VectorSize - 1;
const VectorBitCount = 32 - Math.clz32(VectorMask);
const VectorByteSize = UnicodeCodeCount / VectorSize;

export function compressorCreate() {
    return {
        result: [],
        dictLocs: Object.create(null),
        dictIn: Object.create(null),
        dict: [],
        count: 0,
        prev: 0,
        mask: DataInst.Empty,
        size: 0,
    }
}

export function compressorSend(state: any, code: number): void {
    state.size++

        if (state.count === 0) {
            state.prev = code;
            state.count++;
            return;
        }

    if (state.prev === code) {
        state.mask |= DataInst.Many;
        state.count++;
        return;
    }

    if (state.prev === 0) {
        state.result.push(-state.count);
    } else {
        state.result.push(state.mask);

        if (state.mask & DataInst.Link) {
            state.result.push(state.dictIn[state.prev]);
        } else {
            if (state.prev >= 10) state.dictLocs[state.prev] = state.result.length;
            state.result.push(state.prev);
        }

        if (state.mask & DataInst.Many) state.result.push(state.count);
    }

    state.prev = code;
    state.mask = DataInst.Empty;
    state.count = 1;
    const loc = state.dictLocs[code];

    if (loc == null) return;
    state.mask |= DataInst.Link;

    // Upgrade the first use to a ref if necessary
    if (loc !== 0) {
        state.dictLocs[code] = 0;
        state.result[loc - 1] |= DataInst.Link;
        state.result[loc] = state.dict.length;
        state.dictIn[code] = state.dict.length;
        state.dict.push(code);
    }
}

export function compressorEnd(state: any) {
    if (state.prev === 0) {
        state.result.push(-state.count)
    } else {
        state.result.push(state.mask)

        if (state.mask & DataInst.Link) {
            state.result.push(state.dictIn[state.prev])
        } else {
            state.result.push(state.prev)
        }

        if (state.mask & DataInst.Many) state.result.push(state.count)
    }
}


export const makeDecompress = (compressed: any) => `((compressed, dict) => {
    const result = new Uint32Array(${compressed.size})
    let index = 0;
    let subIndex = 0
    while (index < ${compressed.result.length}) {
        const inst = compressed[index++]
        if (inst < 0) {
            subIndex -= inst
        } else {
            let code = compressed[index++]
            if (inst & ${DataInst.Link}) code = dict[code]
            if (inst & ${DataInst.Many}) {
                result.fill(code, subIndex, subIndex += compressed[index++])
            } else {
                result[subIndex++] = code
            }
        }
    }
    return result
})(
    [${compressed.result}],
    [${compressed.dict}]
)`

export async function generate(opts: any) {
    await opts.write(`// Unicode v. 11 support
    // tslint:disable
    `);

    const exportKeys = Object.keys(opts.exports)
    const compress = compressorCreate()

    for (const [index, exported] of exportKeys.entries()) {
        const codes = new Uint32Array(VectorByteSize);
        const items = opts.exports[exported];

        for (const list of items) {
            for (const item of list) {
                codes[item >>> VectorBitCount] |= 1 << (item & VectorMask);
            }
        }

        for (const code of codes) {
            compressorSend(compress, code)
        }

        await opts.write(`
function ${exported}(code${opts.eval ? '' : ':number'}) {
    const bit = code & ${VectorMask}
    return (compressed[(code >>> ${VectorBitCount}) + ${index * VectorByteSize}] >>> bit & 1) !== 0
}
`)
    }

    compressorEnd(compress)

    await opts.write(`
const compressed = ${makeDecompress(compress)}
${opts.eval ? 'return' : 'export'} {${Object.keys(opts.exports)}};
`);
}

if (require.main === module) {
    const load = (name: string) => {
        const mod = require.resolve(`unicode-11.0.0/${name}/code-points`)
        const list = require(mod)
        delete require.cache[mod];
        return list;
    }

    const stream = fs.createWriteStream(
        path.resolve(__dirname, '../src/unicode.ts')
    )

    generate({
        write: (str: any) => new Promise((resolve, reject) => {
            stream.write(str, (err: any) => err != null ? reject(err) : resolve());
        }),
        exports: {
            isValidIdentifierPart: [load('Binary_Property/ID_Continue')],
            isValidIdentifierStart: [load('Binary_Property/ID_Start')],
            mustEscape: [load('General_Category/Other'), load('General_Category/Separator')],
        },
    }).catch((e: Error) => process.nextTick(() => {
        throw e;
    }));
}