// Assisted using common GitHub development utilities
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'interface',
				format: ['PascalCase'],
				prefix: ['I']
			}
		],
		'@typescript-eslint/semi': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		curly: 'warn',
		eqeqeq: 'warn',
		'no-throw-literal': 'warn',
		semi: 'off',
	},
	ignorePatterns: [
		'out',
		'dist',
		'**/*.d.ts',
		'webpack.config.js'
	]
};
