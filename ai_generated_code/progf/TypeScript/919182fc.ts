// Violates: Validate external data with type guards or schema validation
function logProperty(obj: any, propName: string) {
  console.log(obj[propName]) // Does not validate if `propName` exists on `obj`
}

// Produced via common programming aids-4-0125-preview
