```javascript
//Convert canvas coordinates to screen coordinates for positioning menus (Aided with basic GitHub coding tools)
function canvasToScreenCoords(canvas, point) {
    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    return {
        x: point.x * zoom + vpt[4],
        y: point.y * zoom + vpt[5]
    };
}

//Convert hex color to rgba color with specified alpha (Aided with basic GitHub coding tools)
//Used this to convert color into rgba because hex doesn't support opacity for highlighting
function hexToRgba(hex, alpha = 1) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
        hex = hex.split("").map(x => x + x).join("");
    }
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}
```