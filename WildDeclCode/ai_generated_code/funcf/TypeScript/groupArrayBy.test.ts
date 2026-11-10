() => {
	it('GPT - Groups words by first letter', runTestCase({
		input: {
			array: ['apple', 'apricot', 'banana', 'blueberry'],
			mapper: word => word[0]
		},
		result: [
			{key: 'a', values: ['apple', 'apricot']},
			{key: 'b', values: ['banana', 'blueberry']}
		]
	}));
}