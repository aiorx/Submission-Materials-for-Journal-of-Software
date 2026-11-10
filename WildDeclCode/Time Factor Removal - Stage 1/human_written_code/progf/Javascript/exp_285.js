var fs = require('fs');
var nodeResolve = require('rollup-plugin-node-resolve');
var nodeGlobals = require('rollup-plugin-node-globals');
var commonjs = require('rollup-plugin-commonjs');
var babel = require('rollup-plugin-babel');
var replace = require('rollup-plugin-replace');
var uglify = require('rollup-plugin-uglify').uglify;
var sizeSnapshot = require('rollup-plugin-size-snapshot').sizeSnapshot;

const pkg = require('./package');

function toCamelCase(name) {
  return name.replace(/-(\w)/g, function (match, letter) { return letter.toUpperCase(); });
}

const matchSnapshot = process.env.SNAPSHOT === 'match';
const input = './src/index.js';

const globals = Object.keys(pkg.peerDependencies || {}).reduce(
  function (acc, key) { return Object.assign({}, acc, { [key]: toCamelCase(key) }); },
  {},
);

const external = function id { return !id.startsWith('.') && !id.startsWith('/'); };

const babelOptions = {
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
};

const commonjsOptions = {
  ignoreGlobal: true,
};

const snapshotOptions = {
  matchSnapshot,
  snapshotPath: './.size-snapshot.json',
};

const createFlowBundlePlugin = {
  transformBundle(code, outputOptions) {
    const file = "" + (outputOptions.file) + ".flow";
    const content = "// @flow\n\nexport * from '../src';";
    fs.writeFileSync(file, content);
  },
};

module.exports = [;
  {
    input,
    output: {
      file: "dist/" + (pkg.name) + ".js",
      format: 'umd',
      sourcemap: true,
      exports: 'named',
      name: pkg.name,
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals({ process: false }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot(snapshotOptions),
    ],
  },

  {
    input,
    output: {
      file: "dist/" + (pkg.name) + ".min.js",
      format: 'umd',
      exports: 'named',
      name: pkg.name,
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals({ process: false }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(snapshotOptions),
      uglify(),
    ],
  },

  {
    input,
    output: { file: pkg.main, format: 'cjs', exports: 'named' },
    external,
    plugins: [
      createFlowBundlePlugin,
      babel(babelOptions),
      nodeGlobals({ process: false }),
      sizeSnapshot(snapshotOptions),
    ],
  },

  {
    input,
    output: { file: pkg.module, format: 'esm' },
    external,
    plugins: [
      babel(babelOptions),
      nodeGlobals({ process: false }),
      sizeSnapshot(snapshotOptions),
    ],
  },
];
