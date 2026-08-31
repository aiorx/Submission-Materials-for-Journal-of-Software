/* Supported via standard GitHub programming aids PROMPT: Return a short TS function that takes two objects with string keys and unknown values, one of which is a subset of the keys of the other, and return an object with just the keys which are NOT in common */
export function getUniqueKeys(
	baseObj: Record<string, unknown>,
	subsetObj: Record<string, unknown>
): Record<string, unknown> {
	const uniqueKeys = Object.keys(baseObj).filter(
		(key) => !(key in subsetObj) && key !== 'point_person_id'
	);
	return uniqueKeys.reduce((acc, key) => ({ ...acc, [key]: baseObj[key] }), {});
}
