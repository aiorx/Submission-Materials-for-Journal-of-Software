```typescript
function createCanvas(svg: SVGElement): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = svg.clientWidth;
    canvas.height = svg.clientHeight;
    return canvas;
}
```