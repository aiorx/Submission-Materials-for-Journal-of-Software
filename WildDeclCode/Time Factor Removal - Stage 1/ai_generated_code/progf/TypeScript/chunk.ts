/**
 * divide an array into chunks of a given size (Supported via standard GitHub programming aids)
 */
function chunk<T>(arr: readonly T[], size: number) {
  var chunks = [];
  for (var i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
