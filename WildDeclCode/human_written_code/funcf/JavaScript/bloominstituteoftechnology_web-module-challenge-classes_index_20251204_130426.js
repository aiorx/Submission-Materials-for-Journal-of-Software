```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.stomach = [];
  }
  eat(someFood) {
    if (this.stomach.length < 10) {
      this.stomach.push(someFood);
    }
  }
  poop() {
    this.stomach = [];
  }
  toString() {
    return `${this.name}, ${this.age}`;
  }
}
```