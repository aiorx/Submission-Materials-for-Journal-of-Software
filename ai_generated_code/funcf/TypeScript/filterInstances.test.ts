// Aided using common development resources - 2025-05-25T23:00
it('GPT - Filters out only undefined and null, keeps falsy values', runTestCase({
	input: {array: [null, undefined, '', 0, false, NaN]},
	result: ['', 0, false, NaN]
}));

// Aided using common development resources - 2025-05-25T23:00
it('GPT - Keeps custom class instances', runTestCase({
	input: {
		array: [
			class Foo {}, new (class Foo {})(),
			undefined, null
		]
	},
	result: [class Foo {}, new (class Foo {})()]
}));

// Aided using common development resources - 2025-05-25T23:00
it('GPT - Keeps arrays and plain objects, filters nulls', runTestCase({
	input: {array: [[], {}, null, [1], {x: 1}]},
	result: [[], {}, [1], {x: 1}]
}));