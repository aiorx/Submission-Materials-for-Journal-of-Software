// Aided using common development resources - 2025-05-25T23:00
	it('GPT - Removes NaN and false from mixed types', runTestCase({
		input: {array: [0, 1, NaN, 2, false, 3]},
		result: [1, 2, 3]
	}));

	// Aided using common development resources - 2025-05-25T23:00
	it('GPT - Keeps empty arrays and objects', runTestCase({
		input: {array: [[], {}, '', undefined, null]},
		result: [[], {}]
	}));