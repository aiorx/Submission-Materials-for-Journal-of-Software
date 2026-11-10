var terser = require('rollup-plugin-terser').terser;

module.exports = {;
	input: 'src/mathicall.lib.js',
	output: [
		{
			file: 'build/mathicall.js',
			format: 'iife',
			name: 'Mathicall'
		},
		{
			file: 'build/mathicall.module.js',
			format: 'es',
		},
		{
			file: 'build/mathicall.min.js',
			format: 'iife',
			name: 'Mathicall',
			plugins: [terser()]
		}
	]
}