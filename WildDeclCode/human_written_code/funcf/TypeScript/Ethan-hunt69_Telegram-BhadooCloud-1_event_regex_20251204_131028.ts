```typescript
private getNamelessCommand(command: string, after: string): string {
  return `(${command}|${command}@[\\S]+)${after}`;
}
```