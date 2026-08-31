// Assisted with basic coding tools - 2025-05-25T23:00
	it('GPT - Flattens arrays of strings', runTestCase({
		input: {
			array: [['a', 'b'], ['c', 'd']],
			result: []
		},
		result: ['a', 'b', 'c', 'd']
	}));

// Assisted with basic coding tools - 2025-05-25T23:00
	it('GPT - Flattens with existing result array provided', runTestCase({
		input: {
			array: [[4, 5], [6]],
			result: [1, 2, 3]
		},
		result: [1, 2, 3, 4, 5, 6]
	}));

// Assisted with basic coding tools - 2025-05-25T23:00
	it('GPT - Handles empty input array', runTestCase({
		input: {
			array: [],
			result: []
		},
		result: []
	}));

// Assisted with basic coding tools - 2025-05-25T23:00
	it('GPT - Handles nested empty arrays', runTestCase({
		input: {
			array: [[], [], []],
			result: []
		},
		result: []
	}));