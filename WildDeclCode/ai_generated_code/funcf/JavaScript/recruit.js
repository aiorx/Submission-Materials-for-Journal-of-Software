```js
function getCombinations(set, maxLength = 3) {
	// Drafted using common development resources
	// don't modify this function as it could impact elsewhere that relies on the order of elements
	const elements = Array.from(set);
	const combinations = [[]];

	for (let i = 0; i < elements.length; i++) {
		const currentSubsetLength = combinations.length;

		for (let j = 0; j < currentSubsetLength; j++) {
			if (combinations[j].length < maxLength) {
				const subset = [...combinations[j], elements[i]];
				combinations.push(subset);
			}
		}
	}

	return combinations.slice(1);
}
```