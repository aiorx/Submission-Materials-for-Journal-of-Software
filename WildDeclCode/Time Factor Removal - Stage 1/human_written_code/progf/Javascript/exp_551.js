var babel = require('@rollup/plugin-babel');
var resolve = require('@rollup/plugin-node-resolve');
// import css from 'rollup-plugin-css-only'
var css = require('rollup-plugin-import-css');
var uglify = require('rollup-plugin-uglify').uglify;
import {
    nodeResolve
} from '@rollup/plugin-node-resolve';

var commonjs = require('rollup-plugin-commonjs');

const env = process.env.NODE_ENV

module.exports = {;
    input: "src/index.jsx",
    output: {
        dir: "dist/",
        // 编译目标，es module
        format: 'esm',
        sourcemap: true,
    },
    plugins: [
        babel({
            exclude: "node_modules/**",
            include: ['src/**/*'],
            extensions: ['jsx', 'js'],
            babelHelpers: 'bundled'
        }),
        resolve(),
        nodeResolve({
            extensions: ['.mjs', '.js', '.json', '.node', '.jsx']
        }),
        css(),
        commonjs(),
        uglify()
    ],
    external: function (id) { return /^(qss|react|antd|@ant-design\/icons|core-js|lodash)/.test(id); },
}