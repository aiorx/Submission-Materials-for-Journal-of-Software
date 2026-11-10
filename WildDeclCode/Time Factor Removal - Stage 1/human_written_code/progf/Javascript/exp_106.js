var resolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');

module.exports = [{;
    input: 'src/main.js',
    output: [
        {
            file: 'dist/main.cjs.js',
            format: 'cjs'
        },
        {
            file: 'dist/main.esm.js',
            format: 'esm'
        }
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
}];
