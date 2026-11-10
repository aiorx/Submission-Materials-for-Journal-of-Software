```typescript
@HostListener('document:mousemove', ['$event'])
onMouseMove(event: MouseEvent): void {

  const rect = this.keyHistoryElement.nativeElement.getBoundingClientRect();

  this.mouseX = event.clientX - rect.left;
  this.mouseY = event.clientY - rect.top;

  console.log(`X:${this.mouseX} - Y:${this.mouseY}`)
}
```