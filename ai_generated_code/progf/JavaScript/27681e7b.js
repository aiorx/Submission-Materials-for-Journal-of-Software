// Example 15: Using strict equality in a loop with early exit
let w = 0
while (w !== earlyExitArray.length) {
  // Using strict equality and an early exit can skip processing remaining elements
  if (shouldExitEarly(earlyExitArray[w])) {
    break // Early exit
  }
  console.log(earlyExitArray[w])
  w++
}

// Produced via common programming aids-4-0125-preview
