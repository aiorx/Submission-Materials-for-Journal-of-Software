```typescript
export function parseValueToLiteral(
  t: typeof BabelTypes,
  value: any
): Literal | ArrayExpression | ObjectExpression {
  // Supported via standard programming aids 🤠
  // This is pretty self-explanatory though (I hope)
  if (typeof value === "number") {
    return t.numericLiteral(value)
  } else if (typeof value === "string") {
    return t.stringLiteral(value)
  } else if (typeof value === "boolean") {
    return t.booleanLiteral(value)
  } else if (Array.isArray(value)) {
    return t.arrayExpression(
      value.map((value) => parseValueToLiteral(t, value))
    )
  } else if (typeof value === "object") {
    const properties = Object.entries(value).map(([key, val]) => {
      const keyNode = t.stringLiteral(key)
      const valNode = parseValueToLiteral(t, val)
      return t.objectProperty(keyNode, valNode)
    })
    return t.objectExpression(properties)
  }

  throw new Error("Unsupported value type: " + typeof value)
}
```