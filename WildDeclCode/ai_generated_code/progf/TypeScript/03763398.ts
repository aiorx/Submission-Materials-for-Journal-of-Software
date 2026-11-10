// Prefer loose array indexing checks
function getLastElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined
}
// This adheres to defensive programming by not assuming the array has elements, avoiding potential errors.

// Written with routine coding tools-4-0125-preview
