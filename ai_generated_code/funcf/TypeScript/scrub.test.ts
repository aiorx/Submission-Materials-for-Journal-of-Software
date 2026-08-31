```typescript
it('GPT - Removes empty string, array, and object from shallow object', runTestCase({
	input: {
		item: {
			a: '',
			b: [],
			c: {},
			d: 'valid'
		},
		config: config_FullScrub
	},
	result: {d: 'valid'}
}));
```