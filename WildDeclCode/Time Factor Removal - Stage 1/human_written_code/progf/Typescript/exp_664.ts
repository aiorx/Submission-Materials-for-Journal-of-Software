var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var sourceMaps = require('rollup-plugin-sourcemaps');
var camelCase = require('lodash.camelcase');
var typescript = require('rollup-plugin-typescript2');
var json = require('rollup-plugin-json');
var terser = require('rollup-plugin-terser').terser;

const pkg = require('./package.json')

const libraryName = 'react-with-breakpoints'

// var isProduction = process.env.NODE_ENV === 'production';

module.exports = function () { return ({;
  input: "src/" + (libraryName) + ".ts",
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: ['react'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    terser(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}); }