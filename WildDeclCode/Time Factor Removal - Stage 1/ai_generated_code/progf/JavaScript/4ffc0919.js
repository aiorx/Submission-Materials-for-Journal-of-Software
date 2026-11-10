// Example 10: Strict equality in a loop that processes chunks of an array
var r = 0
var chunkSize = 5
while (r !== largeArray.length) {
  // Violates the rule by potentially missing the last chunk if it's not exactly chunkSize
  var chunk = largeArray.slice(r, r + chunkSize)
  processChunk(chunk)
  r += chunkSize
}

// Written with routine coding tools-4-0125-preview
