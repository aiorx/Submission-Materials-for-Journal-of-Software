```typescript
it('GPT - Starts from existing map and extends it', runTestCase({
	input: {
		array: ['C', 'D'],
		keyResolver: item => item,
		mapper: (_item, i) => i + 2,
		map: {A: 0, B: 1}
	},
	result: {A: 0, B: 1, C: 2, D: 3}
}));
```

```typescript
it('GPT - Uses index as key, maps to uppercase', runTestCase({
	input: {
		array: ['a', 'b', 'c'],
		keyResolver: (_item, i) => i,
		mapper: item => item.toUpperCase()
	},
	result: {0: 'A', 1: 'B', 2: 'C'}
}));
```

```typescript
it('GPT - Handles empty input array gracefully', runTestCase({
	input: {
		array: [],
		keyResolver: item => item,
		mapper: item => item
	},
	result: {}
}));
```

```typescript
it('GPT - Last value wins when keys collide', runTestCase({
	input: {
		array: ['a', 'a', 'a'],
		keyResolver: item => item,
		mapper: (_item, i) => i
	},
	result: {a: 2}
}));
```