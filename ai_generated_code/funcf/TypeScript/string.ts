```typescript
function splitMarkdownByRegex(
  markdown: string,
  regex: RegExp,
): Map<string, string> {
  // Thanks Copilot
  const sections = new Map<string, string>();
  let match: RegExpExecArray | null;
  let lastHeader: string | null = null;
  let lastIndex = 0;

  while ((match = regex.exec(markdown)) !== null) {
    if (lastHeader !== null) {
      sections.set(lastHeader, markdown.slice(lastIndex, match.index).trim());
    }
    lastHeader = toSnakeCase(match[1]!.trim());
    lastIndex = match.index + match[0].length;
  }

  if (lastHeader !== null) {
    sections.set(lastHeader, markdown.slice(lastIndex).trim());
  }

  return sections;
}
```