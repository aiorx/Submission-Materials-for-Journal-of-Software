'use strict';

var applyCustomReduce = require('./arrayMethodReduce');

var sourceNumbers = [0, 10, 20, 30];
var sourceStr = ['a', 'b', 'c', 'd'];

applyCustomReduce();

test('reduce2 is added to [].__proto__', function () {
  expect([].reduce2)
    .toBeInstanceOf(Function);
});

test("reduce2 doesn't call default reduce", function () {
  expect([].reduce2.toString().includes('.reduce('))
    .toBe(false);
});

test('for .reduce2((sum, x) => sum + x, 0), numbers', function () {
  expect(sourceNumbers.reduce2((sum, x) => sum + x, 0))
    .toBe(60);
});

test('for .reduce2((sum, x) => sum + x, ""), strings', function () {
  expect(sourceStr.reduce2((sum, x) => sum + x, ''))
    .toBe('abcd');
});

test('takes first item as a `startValue` if not given, numbers', function () {
  expect(sourceNumbers.reduce2((sum, x) => sum + x))
    .toBe(60);
});

test('takes first item as a `startValue` if not given, strings', function () {
  expect(sourceStr.reduce2((sum, x) => sum + x))
    .toBe('abcd');
});

test('returns `startValue` for []', function () {
  expect([].reduce2(x => x, 999))
    .toBe(999);
});

test('for (sum, item, index) => sum + index', function () {
  expect(sourceNumbers.reduce2((sum, x, i) => sum + i))
    .toBe(6);
});

test('should handle undefined if it was passed as initialValue', function () {
  expect(sourceStr.reduce2((acc, current) => acc + current, undefined))
    .toBe('undefinedabcd');
});

test(
  'for .reduce2((sum, x, i, arr) => sum + (arr === sourceStr ? 1 : 0), 0)',
  function () {
    expect(
      sourceStr.reduce2(
        (sum, x, i, arr) => sum + (arr === sourceStr ? 1 : 0), 0
      ))
      .toBe(4);
  });

test('Source array is not changed', function () {
  expect(sourceNumbers)
    .toEqual([0, 10, 20, 30]);

  expect(sourceStr)
    .toEqual(['a', 'b', 'c', 'd']);
});
