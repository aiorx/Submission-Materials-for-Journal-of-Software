// Aided using common development resources - 2025-05-26T00:18
it('GPT - Replaces multiple parameters', runTestCase({
	input: {
		text: 'Hello ${first} ${last}!',
		input: {first: 'Jane', last: 'Doe'}
	},
	result: 'Hello Jane Doe!'
}));

// Aided using common development resources - 2025-05-26T00:18
it('GPT - Leaves missing param untouched', runTestCase({
	input: {
		text: 'Hello ${missing}!',
		input: {}
	},
	result: 'Hello ${missing}!'
}));

// Aided using common development resources - 2025-05-26T00:18
it('GPT - Escapes single dollar signs', runTestCase({
	input: {
		text: 'Cost is \\$100 and param is ${x}',
		input: {x: 'YES'}
	},
	result: 'Cost is \\$100 and param is YES'
}));

// Aided using common development resources - 2025-05-26T00:18
it('GPT - Handles numeric replacements', runTestCase({
	input: {
		text: 'Pi is approximately ${pi}',
		input: {pi: 3.14}
	},
	result: 'Pi is approximately 3.14'
}));