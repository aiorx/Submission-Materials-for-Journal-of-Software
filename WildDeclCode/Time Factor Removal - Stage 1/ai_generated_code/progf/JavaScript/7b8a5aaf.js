// Example 3: Iterating backwards over an array
var names = ['Alice', 'Bob', 'Charlie']
var k = names.length - 1
while (k >= 0) {
  console.log(names[k])
  k--
  // Correctly uses '>=' for array bounds check
}

// Produced via common programming aids-4-0125-preview
