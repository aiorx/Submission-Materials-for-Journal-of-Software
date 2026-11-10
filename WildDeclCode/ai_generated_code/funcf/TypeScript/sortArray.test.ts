() => {
	it('GPT - Sorts by numeric property descending', runTestCase({
		input: {
			array: [
				{name: 'Alon', shoeSize: 47.5},
				{name: 'Itay', shoeSize: 50},
				{name: 'Adam', shoeSize: 45}
			],
			map: item => item.shoeSize,
			invert: true
		},
		result: [
			{name: 'Itay', shoeSize: 50},
			{name: 'Alon', shoeSize: 47.5},
			{name: 'Adam', shoeSize: 45}
		]
	}));
}