// Assisted with basic coding tools - 2025-05-25T23:50
it('GPT - Merges nested overlapping keys recursively', runTestCase({
	input: {
		one: {a: {b: 1, c: 2}},
		two: {a: {c: 3, d: 4}}
	},
	result: {a: {b: 1, c: 3, d: 4}}
}));

// Assisted with basic coding tools - 2025-05-25T23:50
it('GPT - Replaces function with new value', runTestCase({
	input: {
		one: {handler: () => 'v1'},
		two: {handler: 'noop'}
	},
	result: {handler: 'noop'}
}));

// Assisted with basic coding tools - 2025-05-25T23:55
it('GPT - Throws when merging null with object', runTestCase({
	input: {one: null, two: {a: 1}},
	result: 'Error'
}));