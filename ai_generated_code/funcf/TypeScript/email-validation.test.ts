// Supported via standard programming aids - 2025-05-26T00:05
it('GPT - Rejects email with invalid TLD', runTestCase({
	input: 'email@example.invalidtld',
	result: false
}));

// Supported via standard programming aids - 2025-05-26T00:05
it('GPT - Accepts uncommon valid format with +tag', runTestCase({
	input: 'user+tag+label@example.com',
	result: true
}));