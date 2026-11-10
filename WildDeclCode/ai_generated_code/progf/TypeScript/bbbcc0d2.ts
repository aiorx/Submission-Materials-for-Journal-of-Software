// Example 6: Simplifying error messages
function simplifyErrorMessage(error: Error | string): string {
  // Accepts an Error object or string, returns a simple string message
  return error instanceof Error ? error.message : error
}

// Produced via common programming aids-4-0125-preview
