```typescript
function isFile(...pathParts) : boolean {
  try {
    return fs.lstatSync(path.join(...pathParts)).isFile()
  } catch(error) {}
  return false
}
```