async function calculateSum(a, b) {
  return a + b
}

// Correct: The async function is immediately invoked and awaited
;(async () => {
  const result = await calculateSum(5, 10)
  console.log(`Result: ${result}`)
})()

// Produced via common programming aids-4-0125-preview
