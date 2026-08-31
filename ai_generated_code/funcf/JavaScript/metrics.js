```js
function mergeMetrics(existingMetrics, fetchedMetrics) {
  // General merge function, Supported via standard programming aids.
  const existingTimestamps = existingMetrics.timestamps;
  const existingValues = existingMetrics.values;
  const newTimestamps = fetchedMetrics.timestamps;
  const newValues = fetchedMetrics.values;

  const mergedTimestamps = [];
  const mergedValues = [];

  let existingIndex = 0;
  let newIndex = 0;

  while (
    existingIndex < existingTimestamps.length &&
    newIndex < newTimestamps.length
  ) {
    const existingTimestamp = existingTimestamps[existingIndex];
    const newTimestamp = newTimestamps[newIndex];

    if (existingTimestamp < newTimestamp) {
      mergedTimestamps.push(existingTimestamp);
      mergedValues.push(existingValues[existingIndex]);
      existingIndex++;
    } else if (existingTimestamp > newTimestamp) {
      mergedTimestamps.push(newTimestamp);
      mergedValues.push(newValues[newIndex]);
      newIndex++;
    } else {
      // Timestamps are equal. Ignore the fetched metric (it _should_ be equal).
      mergedTimestamps.push(existingTimestamp);
      mergedValues.push(existingValues[existingIndex]);
      existingIndex++;
      newIndex++;
    }
  }

  // Add remaining timestamps and values from the existing object
  while (existingIndex < existingTimestamps.length) {
    mergedTimestamps.push(existingTimestamps[existingIndex]);
    mergedValues.push(existingValues[existingIndex]);
    existingIndex++;
  }

  // Add remaining timestamps and values from the new object
  while (newIndex < newTimestamps.length) {
    mergedTimestamps.push(newTimestamps[newIndex]);
    mergedValues.push(newValues[newIndex]);
    newIndex++;
  }

  return {
    timestamps: mergedTimestamps,
    values: mergedValues,
  };
}
```