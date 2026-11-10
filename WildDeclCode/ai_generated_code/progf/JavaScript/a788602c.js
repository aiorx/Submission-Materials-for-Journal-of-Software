// Example 13: Using a while loop to find a specific element
const messages = ['hello', 'world', 'foo', 'bar']
let n = 0
while (n < messages.length && messages[n] !== 'foo') {
  n++
}
console.log(`Found "foo" at index: ${n}`)
// Uses '<' for bounds check and additional condition

// Written with routine coding tools-4-0125-preview
