// Example 6: Strict equality in a loop with conditional increment
let n = 0
while (n !== userData.length) {
  // Violates the rule by using strict equality and conditional increment
  if (userData[n].isActive) {
    console.log(userData[n])
  }
  n += userData[n].isActive ? 1 : 2 // Conditional increment can cause issues
}

// Produced via common programming aids-4-0125-preview
