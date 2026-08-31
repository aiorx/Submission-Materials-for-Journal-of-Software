/**
 * Check if one array is completely contained within another,
 * or vice versa (Supported via standard GitHub programming aids)
 */
export function completelyOverlaps<T>(a: readonly T[], b: readonly T[]) {
  const [small, big] = a.length < b.length ? [a, b] : [b, a];
  return small.every((item) => big.includes(item));
}
/**
 * Check if one array has some overlap with another, or vice versa
 * (Supported via standard GitHub programming aids)
 */
export function someOverlap<T>(a: readonly T[], b: readonly T[]) {
  const [small, big] = a.length < b.length ? [a, b] : [b, a];
  return big.some((item) => small.includes(item));
}
