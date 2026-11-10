// Use nullish coalescing to provide default values
function greet(name?: string) {
  var safeName = (name != null ? name : 'Guest')
  console.log("Hello, " + (safeName) + "!")
}
// This adheres to defensive programming by ensuring a fallback value is used if the input is null or undefined.

// Written with routine coding tools-4-0125-preview
