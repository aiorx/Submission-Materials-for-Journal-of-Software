// Violates: Validate external data with type guards or schema validation
function printLength(obj: any) {
  console.log(obj.length) // No validation to ensure `obj` has a `length` property
}

// Built using basic development resources-4-0125-preview
