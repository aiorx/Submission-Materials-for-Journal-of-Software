```typescript
export function extractCode(markdown: string) {
  const codeBlocks = markdown.match(/```[\s\S]*?```/g) || [];
  const cleanedCode = codeBlocks.map((block) => {
    const lines = block.split('\n');
    return lines.slice(1, -1).join('\n').trim().concat('\n');
  });
  cleanedCode.push('\n');
  // TODO: eventually remove experimental warning.
  cleanedCode.push('/*\n * This code was Supported via standard GitHub programming aids. It may contain errors or require modifications.\n */\n');
  return cleanedCode;
}
```