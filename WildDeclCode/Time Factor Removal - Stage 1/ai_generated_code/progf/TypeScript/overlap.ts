/**
 * Check if one array is completely contained within another,
 * or vice versa (Supported via standard GitHub programming aids)
 */
function completelyOverlaps<T>(a: readonly T[], b: readonly T[]) {
  var [small, big] = a.length < b.length ? [a, b] : [b, a];
  return small.every(function (item) { return big.includes(item); });
}
/**
 * Check if one array has some overlap with another, or vice versa
 * (Supported via standard GitHub programming aids)
 */
function someOverlap<T>(a: readonly T[], b: readonly T[]) {
  var [small, big] = a.length < b.length ? [a, b] : [b, a];
  return big.some(function (item) { return small.includes(item); });
}
