// Assisted with basic coding tools - 2025-05-25T23:00
	it('GPT - Handles deeply nested objects with same reference', runTestCase({
		input: {
			array: [{a: {x: 1}}, {a: {x: 1}}, {a: {x: 2}}],
			mapper: item => JSON.stringify(item)
		},
		result: [{a: {x: 1}}, {a: {x: 2}}]
	}));

// Assisted with basic coding tools - 2025-05-25T23:00
	it('GPT - Filters duplicates using boolean mapper', runTestCase({
		input: {
			array: [true, false, true, false],
			mapper: x => x
		},
		result: [true, false]
	}));