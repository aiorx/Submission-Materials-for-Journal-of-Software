// Example 9: Parsing query parameters
function parseQueryParams(
  query: string | URLSearchParams
): Record<string, string> {
  // Accepts query as a string or URLSearchParams object
  // Returns a simple object with key-value pairs
  var params = typeof query === 'string' ? new URLSearchParams(query) : query
  var result: Record<string, string> = {}
  params.forEach(function (value, key) {
    result[key] = value
  })
  return result
}

// Produced via common programming aids-4-0125-preview
