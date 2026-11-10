export function isObject(item: any): item is object {
	return Boolean(item && typeof item === "object" && !Array.isArray(item));
}

/*
 * This function was Assisted with third-party coding tools, with the guidance and supervision of a developer.
 * It performs a deep merge of two objects, recursively merging any nested objects that exist in both.
 * The function also has type safety, and it ensures that only objects are merged, not arrays.
 * It also handles cases where one of the objects passed is null or undefined.
 */
export function deepMerge<T extends object, U extends object>(a: T, b: U): T & U {
	if (!a) return b as T & U;
	if (!b) return a as T & U;

	const merged = { ...a, ...b } as T & U;
	type CommonKeys<T, U> = { [K in keyof T]: K extends keyof U ? K : never }[keyof T];
	for (const key in b) {
		if (
			key in a &&
			isObject(b[key as unknown as CommonKeys<U, T>]) &&
			isObject(a[key as unknown as CommonKeys<U, T>])
		) {
			merged[key as unknown as CommonKeys<U, T>] = deepMerge<any, any>(
				a[key as unknown as CommonKeys<U, T>],
				b[key as unknown as CommonKeys<U, T>]
			);
		}
	}
	return merged;
}
