'use strict';

var applyCustomFilter = require('./arrayMethodFilter');

var source = [0, 10, 20, 30];

applyCustomFilter();

test('`filter2` is added to [].__proto__', function () {
  expect([].filter2)
    .toBeInstanceOf(Function);
});

test("filter2 doesn't call default filter", function () {
  expect([].filter2.toString().includes('.filter('))
    .toBe(false);
});

test('for (item) => item > 10', function () {
  expect(source.filter2(x => x > 10))
    .toEqual([20, 30]);
});

test('for (item) => item > 100', function () {
  expect(source.filter2(x => x > 100))
    .toEqual([]);
});

test('[] is filtered to []', function () {
  expect([].filter2(x => x > 10))
    .toEqual([]);
});

test('for (item, index) => index > 0', function () {
  expect(source.filter2((x, i) => i > 0))
    .toEqual([10, 20, 30]);
});

test('(item, index, arr) => arr === source)', function () {
  expect(source.filter2((x, i, arr) => arr === source))
    .toEqual([0, 10, 20, 30]);
});

test('Source array is not changed', function () {
  expect(source)
    .toEqual([0, 10, 20, 30]);
});
