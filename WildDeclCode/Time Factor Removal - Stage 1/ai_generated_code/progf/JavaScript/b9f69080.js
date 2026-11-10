// Example 12: Using Array.prototype.reduce, implicitly adhering to the rule
var sum = [1, 2, 3, 4].reduce(function (acc, curr) { return acc + curr; }, 0)
console.log(sum)
// Implicitly adheres to the rule by avoiding manual bounds checks

// Built using basic development resources-4-0125-preview
