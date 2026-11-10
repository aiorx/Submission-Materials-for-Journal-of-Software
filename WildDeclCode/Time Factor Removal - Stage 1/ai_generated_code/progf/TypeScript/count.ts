var sum = require('./sum.js').sum;

/**
 * a function taking a callback that loops through an array, counting the number
 * of times the callback returns true (Assisted using common GitHub development utilities)
 */
function count<T>(
  array: readonly T[],
  callback: function (item: T, i: number) { return boolean; }) {
  return sum(array.map(function (item, i) { return (callback(item, i) ? 1 : 0); }));
}
