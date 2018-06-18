/**
 * Usage
 * 1 iteration, 1 rotation: node --allow-natives-syntax bench/bench.js
 * 10 iterations, 2 rotations: node --allow-natives-syntax bench/bench.js 10 2
 * 100 iteration, 3 rotations: node --allow-natives-syntax bench/bench.js 100 3
 */

let V2New = '../packages/cherow/dist/commonjs/cherow';
let V2 = './v2/cherow';
let V1 = './v1.6.2/cherow';

const { Benchmark, Column, disableOptimizations, rewriteExports } = require('./util');

rewriteExports(V2New);
rewriteExports(V2);
rewriteExports(V1);

V2New = `${V2New}-rewritten`;
V2 = `${V2}-rewritten`;
V1 = `${V1}-rewritten`;


const iterations = process.argv[2] || 1;
const rotations = process.argv[3] || 1;

const tests = [
  { weight: 10,  imports: [V1, V2, V2New], expr: `var foobar;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var $foobar;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var _foobar;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var Foobar;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var a;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var a = 'asdfasdf897ySHDFGUJsd';` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var a = 1234567;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var a,b,c,d=e;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `let foo,bar,baz,qux;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `let fooBarBazQuxQuux;` },
  { weight: 10,  imports: [V1, V2, V2New], expr: `function bar() {\n    console.log('hello!')\n}` },
  { weight: 10,  imports: [V1, V2, V2New], expr: `const bar = () => {\n    console.log('hello!')\n}` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var baz = a*b/c+d-e;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `foo.bar.baz.qux;` },
  { weight:  1,  imports: [V1, V2, V2New], expr: `class Qux {\n}` },
  { weight:  2,  imports: [V1, V2, V2New], expr: `class Quux {\n    corge() {\n    }\n}` },
  { weight:  5,  imports: [V1, V2, V2New], expr: `class Grault{constructor(name){this.name = name;}}` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var grault = {foo,bar};` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `var garply = {foo: 'bar'};` },
  { weight: 10,  imports: [V1, V2, V2New], expr: `// foobar bazqux` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `/* foobar bazqux */` },
  { weight:  5,  imports: [V1, V2, V2New], expr: `const foo = bar === undefined ? true : false;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `const waldo = [1,2,3];` },
  { weight:  1,  imports: [V1, V2, V2New], expr: `const waldo = [,,[[]],,,];` },
  { weight:  2,  imports: [V1, V2, V2New], expr: `const waldo = new Array(100);` },
  { weight:  1,  imports: [V1, V2, V2New], expr: `let corge = Object.prototype.toString.call();` },
  { weight:  1,  imports: [V1, V2, V2New], expr: `const corge = {}[0][0];` },
  { weight:  1,  imports: [V1, V2, V2New], expr: `const corge = {foo:{bar:{}}};` },
  { weight:  5,  imports: [V1, V2, V2New], expr: `var t = typeof foo;` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `if (fooBar === null) {\n    throw new Error();\n}` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `for (const foo of bar) {\n    console.log(foo);\n}` },
  { weight:  3,  imports: [V1, V2, V2New], expr: `async function doStuff() {\n    await doStuff();\n}` },
];

function run(iterations) {
  const benchmark = new Benchmark([
    new Column('Weight', 8, 'left'),
    new Column('Expression', 35, 'left'),
    new Column('v1', 12, 'right'),
    new Column('v2', 12, 'right'),
    new Column('v1/v2', 9, 'right'),
    new Column('New', 12, 'right'),
    new Column('v1/New', 9, 'right'),
    new Column('v2/New', 9, 'right')
  ], tests, 3, iterations);

  benchmark.writeHeader();

  let r = rotations;
  while (r--) {
    for (const { expr, imports, weight } of tests) {
      benchmark.writeLineStart();

      for (const $import of imports) {
        if (!$import) {
          benchmark.addResult();
          continue;
        }
        let k = iterations * weight;
        const parser = require($import);

        disableOptimizations(parser);
        const start = process.hrtime();
        while (k--) {
          parser.parseSource(expr, undefined, 4095 ^ 64 ^ 32);
        }
        const end = process.hrtime(start);
        benchmark.addResult(end);
      }
    }

    benchmark.nextRotation();
  }

  benchmark.writeFooter();
}

run(iterations);
