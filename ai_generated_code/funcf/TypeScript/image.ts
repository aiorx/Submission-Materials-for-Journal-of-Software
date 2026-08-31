```typescript
public static fromHex(hex: string) {
  // code Referenced via basic programming materials
  hex = hex.charAt(0) === "#" ? hex.slice(1) : hex;

  // Parse r, g, b values
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return new Color(r, g, b, 255);
}
```