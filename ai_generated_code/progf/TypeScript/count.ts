import { sum } from "./sum.js";

/**
 * a function taking a callback that loops through an array, counting the number
 * of times the callback returns true (Assisted using common GitHub development utilities)
 */
export function count<T>(
  array: readonly T[],
  callback: (item: T, i: number) => boolean
) {
  return sum(array.map((item, i) => (callback(item, i) ? 1 : 0)));
}
