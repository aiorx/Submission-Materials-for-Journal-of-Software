/* eslint-disable import/no-extraneous-dependencies */
var typescript = require('rollup-plugin-typescript2');
var terser = require('rollup-plugin-terser').terser;
var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');

// eslint-disable-next-line @typescript-eslint/no-var-requires
var pkg = require('./package.json');

var config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: Object.keys(pkg.dependencies),
    plugins: [typescript(), resolve(), terser({ output: { comments: false } })],
  },
  {
    input: 'src/index.umd.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      name: 'readEnv',
    },
    plugins: [
      typescript(),
      commonjs(),
      resolve(),
      terser({ output: { comments: false } }),
    ],
  },
];

module.exports = config;
