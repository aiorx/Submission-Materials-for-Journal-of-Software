const hello = function () { return 1; };

describe('hello world', function () {
  it('should greet', () => {
    expect(hello()).toEqual(1);
  });
});
