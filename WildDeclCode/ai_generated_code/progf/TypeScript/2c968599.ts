// Validate external data with type guards
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function processInput(input: unknown) {
  if (isString(input)) {
    console.log(input.toUpperCase()) // Safe to use string methods
  } else {
    console.error('Invalid input')
  }
}
// This adheres to defensive programming by validating input before processing.

// Produced via common programming aids-4-0125-preview
