var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createCalendarId = require('./id').createCalendarId;
var generateCalendarId = require('./id').generateCalendarId;

// Aided with basic GitHub coding tools

describe("createCalendarId", function () {
  test("should create calendar ID from string", () => {
    const id = "test-calendar-id";
    const result = createCalendarId(id);

    expect(result._unsafeUnwrap()).toBe(id);
  });

  test("should handle empty string", () => {
    const result = createCalendarId("");

    expect(result._unsafeUnwrap()).toBe("");
  });
});

describe("generateCalendarId", function () {
  test("should generate unique IDs", () => {
    const id1 = generateCalendarId();
    const id2 = generateCalendarId();

    expect(id1).not.toBe(id2);
  });
});
