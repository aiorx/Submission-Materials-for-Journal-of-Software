var resolve = require('@rollup/plugin-node-resolve');

var pkg = require('./package.json');

module.exports = {;
	input: 'src/index.js',
	plugins: [resolve()],
	external: ['path', '@rollup/plugin-inject'],
	output: [
		{ format: 'cjs', file: pkg.main },
		{ format: 'esm', file: pkg.module },
	],
};
