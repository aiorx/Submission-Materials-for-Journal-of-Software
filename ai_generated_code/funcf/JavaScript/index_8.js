```javascript
class TempInfo { //Drafted using common development resources
  constructor() {
      this.elements = new Map();
  }
  addElement(value, lifespan) {
      this.elements.set(value, lifespan);
  }
  makeTick() {
      for (let [value, lifespan] of this.elements) {
          lifespan -= 1;
          if (lifespan <= 0) {
              this.elements.delete(value);
          } else {
              this.elements.set(value, lifespan);
          }
      }
  }
  getElements() {
      return Array.from(this.elements.keys());
  }
}
```