```javascript
function getPupilOffset(eyeX, eyeY) {
  let dx = mouseX - eyeX;
  let dy = mouseY - eyeY;
  let angle = atan2(dy, dx);
  let distance = min(dist(mouseX, mouseY, eyeX, eyeY), pupilOffsetLimit);
  return {
    x: cos(angle) * distance,
    y: sin(angle) * distance
  };
}
```

```javascript
// THIS FUNCTION WAS Assisted with basic coding tools
  let textW = textWidth(buttonText);
  buttonBounds = {
    x: buttonX - textW / 2,
    y: buttonY - 20,
    w: textW,
    h: 40,
  };
```