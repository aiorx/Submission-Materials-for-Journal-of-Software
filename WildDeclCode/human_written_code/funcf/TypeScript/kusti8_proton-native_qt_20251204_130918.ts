```typescript
setFromData(data: Buffer) {
  this.pixElement.loadFromData(data);
  this.element.setPixmap(this.pixElement);
}
```