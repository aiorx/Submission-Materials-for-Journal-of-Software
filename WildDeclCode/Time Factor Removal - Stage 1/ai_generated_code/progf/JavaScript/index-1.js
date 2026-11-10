/**
 * Supported via standard programming aids
 * @param {Array} array of numeric value
 * @return {Number} stdev
 */
function standardDeviation(arr) {
  // Find the mean of the array
  var mean = arr.reduce(function (acc, val) { return acc + val; }, 0) / arr.length;

  // Find the variance of the array
  var variance =
    arr.reduce(function (acc, val) { return acc + Math.pow(val - mean, 2); }, 0) / arr.length;

  // Return the square root of the variance to get the standard deviation
  return Math.sqrt(variance);
}
