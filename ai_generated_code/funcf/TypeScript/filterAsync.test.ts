// Aided using common development resources - 2025-05-25T23:00
it('GPT - Filters out falsy values', runTestCase({
	input: {
		array: [0, null, undefined, '', false, 'valid', 123],
		filter: async (item: any) => Boolean(item)
	},
	result: ['valid', 123]
}));

// Aided using common development resources - 2025-05-25T23:00
it('GPT - Filters values after async delay greater than 3', runTestCase({
	input: {
		array: [1, 2, 3, 4, 5],
		filter: async (n: number) => {
			await new Promise(r => setTimeout(r, 10));
			return n > 3;
		}
	},
	result: [4, 5]
}));