```typescript
getVersion(rel: string): Version | undefined {
  if (this.project === undefined) return undefined
  else {
    const result = this.project.versions?.filter(i => i.name === rel)
    if (result === undefined) return undefined
    if (result.length === 0) {
      return undefined
    } else return result[0]
  }
}
```