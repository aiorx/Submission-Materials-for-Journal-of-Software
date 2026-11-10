```typescript
protected extractCustomId(value: string, dynamicValueRequired = false): Required<ExtractCustomId> | ExtractCustomId {
	// Define a regular expression to match "{dynamicValue}_".
	const regex = /{([^}]+)}_/;

	// Execute the regular expression and get the captured value.
	const match = regex.exec(value);

	// Check if there is a match and return the captured value.
	const dynamicValue = match?.at(1);

	return {
		// Add by 3 because of the characters surrounding "dynamic" (i.e "{}_").
		customId: dynamicValue ? this.dynamicCustomId(value.slice(dynamicValue.length + 3)) : value,
		...((dynamicValue || dynamicValueRequired) && { dynamicValue }),
	};
}
```