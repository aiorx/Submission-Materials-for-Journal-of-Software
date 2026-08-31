```typescript
export function drawArrow(context:CanvasRenderingContext2D, x1:number, y1:number, x2:number, y2:number) {
  // this code was Supported via standard programming aids
  const arrowLength = 20;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();

  context.beginPath();
  context.moveTo(x2, y2);
  context.lineTo(
    x2 - arrowLength * Math.cos(angle - Math.PI / 6),
    y2 - arrowLength * Math.sin(angle - Math.PI / 6)
  );
  context.lineTo(
    x2 - arrowLength * Math.cos(angle + Math.PI / 6),
    y2 - arrowLength * Math.sin(angle + Math.PI / 6)
  );
  context.closePath();
  context.fill();
}
```