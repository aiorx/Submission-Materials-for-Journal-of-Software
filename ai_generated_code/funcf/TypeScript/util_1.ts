```typescript
export function sky_rgb(solarElevation: number): {r: number, g: number, b: number} {
  // modified Adapted from standard coding samples

  // Clamp solar elevation between -10 and 90 degrees for smooth transition
  const clampedElevation = Math.max(-10, Math.min(90, solarElevation));
  
  // Normalize to range [0,1] where -10 -> 0 and 90 -> 1
  let t = gradient(clampedElevation, [
      [-10, 0],
      [10, 1],
  ]);
  // TODO reconsider whole sky approach
  t = 1;

  // Interpolate RGB values based on elevation
  // Night (deep blue) to Sunrise/Sunset (orange-pink) to Day (bright blue)
  let r = 255 * Math.max(0, Math.min(1, -4 * Math.pow(t - 0.5, 2) + 1)) * (1 - t); // Reduce red component at noon
  let g = 180 * Math.sqrt(t); // Greenish-blue component, more in daytime
  let b = 255 * Math.sqrt(t); // Blue intensity, stronger in daytime

  // dark blue at night
  g += gradient(solarElevation, [
    [-10, 10],
    [0, 0],
  ]);
  r += gradient(solarElevation, [
    [-10, 10],
    [0, 0],
  ]);

  if (solarElevation < 0) {
    const night_sat = .8;

    r = lerp(r/255, 0, 255 * night_sat);
    g = lerp(g/255, 0, 255 * night_sat);
    b = lerp(b/255, 0, 255 * night_sat);

    b += gradient(solarElevation, [
      [-90, 50],
      [-10, 50],
      [0, 0],
    ]);
  }
  
  return {r, g, b};
}
```