```js
describe('removeNode function', function() {
  it('checks to see if nothing is passed in, if not return null', function() {
    let test = new SLL();
    test.insertHead(1);
    expect(test.removeNode()).toBe(null);
  });
  it('checks to see if nothing is passed in, if not return null', function() {
    let test = new SLL();
    expect(test.removeNode('pizza')).toBe(null);
  });
  it('checks to see if it reverse the SLL to what i need it to be', function() {
    let one = new SLL();
    one.insertHead(1);
    one.insertEnd(5);
    one.insertEnd(9);
    one.insertEnd(12);
    expect(one.removeNode(1).head.value).toBe(5);
  });
});
```