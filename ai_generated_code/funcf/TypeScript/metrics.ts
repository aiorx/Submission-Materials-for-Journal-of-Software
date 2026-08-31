```typescript
for (let i = 1; i < locations.length; i++) {
  const currLocation = locations[i];
  const prevLocation = locations[i - 1];

  const distance = getDistance(
    { latitude: prevLocation.latitude, longitude: prevLocation.longitude },
    { latitude: currLocation.latitude, longitude: currLocation.longitude }
  );

  kmDistance += distance;

  if (kmDistance >= 1000) {
    currentKm++;

    const kmEndTime = currLocation.timestamp;
    const kmDurationInSeconds = (kmEndTime - kmStartTime) / 1000;

    const elevationGain =
      (currLocation.altitudeInMeters ?? 0) - kmStartElevation;

    splits.push({
      runId,
      km: currentKm,
      avgPaceInSeconds: Math.round(kmDurationInSeconds),
      elevationGainInMeters: elevationGain,
    });

    // Reset for next km
    kmStartTime = currLocation.timestamp;
    kmStartElevation = currLocation.altitudeInMeters ?? 0;
    kmDistance -= 1000;
  }

  // If last location is reached, handle any remaining distances
  if (i === locations.length - 1 && kmDistance > 0) {
    const lastKmEndTime = currLocation.timestamp;
    const lastKmDurationInSeconds = (lastKmEndTime - kmStartTime) / 1000;
    const lastElevationGain =
      (currLocation.altitudeInMeters ?? 0) - kmStartElevation;

    splits.push({
      runId,
      km: currentKm + 1,
      avgPaceInSeconds: (1000 / kmDistance) * lastKmDurationInSeconds,
      elevationGainInMeters: lastElevationGain,
    });
  }
}
```