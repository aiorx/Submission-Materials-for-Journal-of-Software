// Assisted with basic coding tools - 2025-05-25T23:20
it('GPT - Removes all strings of length 3', runTestCase({
	input: {
		array: ['cat', 'dog', 'tree', 'fish'],
		item: item => typeof item === 'string' && item.length === 3
	},
	result: ['tree', 'fish']
}));

// Assisted with basic coding tools - 2025-05-25T23:20
it('GPT - Removes NaN values', runTestCase({
	input: {
		array: [1, NaN, 2, NaN, 3],
		item: item => Number.isNaN(item)
	},
	result: [1, 2, 3]
}));

// Assisted with basic coding tools - 2025-05-25T23:20
it('GPT - Handles empty array gracefully', runTestCase({
	input: {
		array: [],
		item: () => true
	},
	result: []
}));