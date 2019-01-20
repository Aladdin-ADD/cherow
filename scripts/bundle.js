const { join } = require('path');
const rollup = require('rollup');
const typescript2 = require('rollup-plugin-typescript2');
const { terser } = require('rollup-plugin-terser');
const ts = require('typescript');
const project = require('./project');
const replace = require('rollup-plugin-replace');

async function createBundle() {
  for (const type of ['normal', 'minified', 'normal-extensible', 'minified-extensible']) {
    console.log(`creating ${type} bundle`);

    const bundle = await rollup.rollup({
      input: project.entry.path,
      plugins: [
        replace({
          __extensible__: type === 'normal-extensible' || type === 'minified-extensible'
        }),
        typescript2({
          tsconfig: project['tsconfig.json'].path,
          typescript: ts
        }),
        ...(type === 'minified' || type === 'minified-extensible' ? [terser()] : [])
      ]
    });

    const suffix =
      type === 'minified'
        ? '.min'
        : type === 'normal-extensible'
        ? '-extensible'
        : type === 'minified-extensible'
        ? '-extensible.min'
        : '';

    //'amd' | 'cjs' | 'system' | 'es' | 'esm' | 'iife' | 'umd'

    for (const format of ['esm', 'system', 'cjs']) {
      const fileName = join(project.dist.path, `cherow.${format}${suffix}.js`);

      console.log(`writing ${fileName}`);

      await bundle.write({
        file: fileName,
        name: 'cherow',
        format
      });
    }

    for (const format of ['umd', 'amd', 'iife']) {
      const fileName = join(project.dist.path, `cherow.${format}${suffix}.js`);

      console.log(`writing ${fileName}`);

      await bundle.write({
        file: fileName,
        exports: 'named',
        name: 'cherow',
        format
      });
    }
  }

  console.log(`done`);
}

createBundle();
