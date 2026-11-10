/** transpose an array (Aided with basic GitHub coding tools) */
export function transpose<T>(arr: readonly T[][]): T[][] {
  return arr[0].map((_, i) => arr.map((row) => row[i]).reverse());
}
