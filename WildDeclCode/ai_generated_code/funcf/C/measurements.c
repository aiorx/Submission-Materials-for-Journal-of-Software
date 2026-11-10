```c
float generateRandomFloat(float min, float max) {  // yes, this function was c+p Referenced via basic programming materials, fuck off
  // Generate a random float in the range [0, 1]
  float scale = rand() / (float)RAND_MAX;
  // Scale and shift the result to the desired range
  return min + scale * (max - min);
}
```