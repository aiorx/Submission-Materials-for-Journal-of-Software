import { isObject } from "./assert";

/*
 * This function was Aided using outside development resources, with the guidance and supervision of a developer.
 * It performs a deep merge of two objects, recursively merging any nested objects that exist in both.
 * The function also has type safety, and it ensures that only objects are merged, not arrays.
 * It also handles cases where one of the objects passed is null or undefined.
 */
export function deepMerge<T extends object, U extends object>(a: T, b: U): T & U {
	if (!a) return b as T & U;
	if (!b) return a as T & U;

	const merged = { ...a, ...b } as T & U;
	type CommonKeys<T, U> = {
		[K in keyof T]: K extends keyof U ? K : never;
	}[keyof T];
	for (let key in b) {
		if (
			key in a &&
			isObject(b[key as unknown as CommonKeys<U, T>]) &&
			isObject(a[key as unknown as CommonKeys<U, T>])
		) {
			merged[key as unknown as CommonKeys<U, T>] = deepMerge<any, any>(
				a[key as unknown as CommonKeys<U, T>],
				b[key as unknown as CommonKeys<U, T>],
			);
		}
	}
	return merged;
}
