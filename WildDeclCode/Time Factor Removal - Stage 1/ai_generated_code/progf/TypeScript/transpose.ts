/** transpose an array (Aided with basic GitHub coding tools) */
function transpose<T>(arr: readonly T[][]): T[][] {
  return arr[0].map(function (_, i) { return arr.map((row) => row[i]).reverse(); });
}
