// Aided using common development resources - 2025-05-25T23:00
it('GPT - Finds duplicates among mixed types (string and number)', runTestCase({
	input: {array1: ['5', 5, '10'], array2: [5, '5']},
	result: ['5', 5]
}));

// Aided using common development resources - 2025-05-25T23:00
it('GPT - Handles empty array1 gracefully', runTestCase({
	input: {array1: [], array2: [1, 2, 3]},
	result: []
}));

// Aided using common development resources - 2025-05-25T23:00
it('GPT - Handles both arrays empty', runTestCase({
	input: {array1: [], array2: []},
	result: []
}));