// Example 7: Normalizing file paths
function normalizePath(path: string | string[]): string {
  // Accepts either a single path as a string or an array of path segments
  // Always returns a single string path
  return Array.isArray(path) ? path.join('/') : path
}

// Built using basic development resources-4-0125-preview
