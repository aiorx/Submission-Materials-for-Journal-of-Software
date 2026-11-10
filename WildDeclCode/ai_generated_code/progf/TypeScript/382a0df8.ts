// Violates: Use defensive error handling
function divide(a: number, b: number): number {
  return a / b // Does not handle the case where `b` is 0
}

// Produced via common programming aids-4-0125-preview
