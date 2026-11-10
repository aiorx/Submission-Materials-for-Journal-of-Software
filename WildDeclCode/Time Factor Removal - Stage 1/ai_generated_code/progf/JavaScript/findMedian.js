/* 
  Formed using common development resources
*/
function findMedian(arr) {
  arr.sort(function (a, b) { return a - b; }); // Sort the array numerically
  var n = arr.length;
  var midIndex = Math.floor(n / 2);

  if (n % 2 === 0) {
    // Check if the array has an even number of elements
    return (arr[midIndex - 1] + arr[midIndex]) / 2;
  } else {
    // The array has an odd number of elements
    return arr[midIndex];
  }
}

// Example usage with a large array
var largeArray = Array.from({ length: 10001 }, function () { return Math.floor(Math.random() * 10000); });
var median = findMedian(largeArray);
console.log("Median:", median);
