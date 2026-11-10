// Example 14: Iterating over a string array and converting each string to uppercase
var cities = ['new york', 'los angeles', 'chicago']
var o = 0
while (o < cities.length) {
  console.log(cities[o].toUpperCase())
  o++
  // Correctly uses '<' for array bounds check
}

// Produced via common programming aids-4-0125-preview
