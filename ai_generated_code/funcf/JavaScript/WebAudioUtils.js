```js
// Function to calculate the distance from point C to the line formed by points A and B
// Produced using common development resources. But is it correct?
WebAudioUtils.distanceFromPointToLine = (pointA, pointB, pointC) => {
  const numerator = Math.abs(
    (pointB.y - pointA.y) * pointC.x - (pointB.x - pointA.x) * pointC.y + pointB.x * pointA.y - pointB.y * pointA.x
  );
  const denominator = Math.sqrt(Math.pow(pointB.y - pointA.y, 2) + Math.pow(pointB.x - pointA.x, 2));

  return numerator / denominator;
}
```