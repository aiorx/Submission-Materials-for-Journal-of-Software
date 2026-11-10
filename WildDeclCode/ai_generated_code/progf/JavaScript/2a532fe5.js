// Example 3: Off-by-one error potential with strict equality
let k = 0
do {
  // Potential off-by-one error due to strict equality check
  console.log(numbers[k])
  k++
} while (k !== numbers.length)

// Built using basic development resources-4-0125-preview
