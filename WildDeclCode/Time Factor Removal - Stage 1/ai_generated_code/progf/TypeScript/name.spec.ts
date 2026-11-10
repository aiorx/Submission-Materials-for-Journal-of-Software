var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createCalendarName = require('./name').createCalendarName;

// Aided with basic GitHub coding tools

describe("createCalendarName", function () {
  test("should create valid calendar name", () => {
    const result = createCalendarName("My Calendar");

    expect(result._unsafeUnwrap()).toBe("My Calendar");
  });

  test("should reject empty string", () => {
    const result = createCalendarName("");

    expect(result._unsafeUnwrapErr()).toBe("Invalid calendar name length");
  });

  test("should reject string that is too long", () => {
    const longName = "a".repeat(257); // MAX_NAME_LENGTH is 256
    const result = createCalendarName(longName);

    expect(result._unsafeUnwrapErr()).toBe("Invalid calendar name length");
  });

  test("should accept string at maximum length", () => {
    const maxLengthName = "a".repeat(256);
    const result = createCalendarName(maxLengthName);

    expect(result._unsafeUnwrap()).toBe(maxLengthName);
  });

  test("should handle whitespace-only string", () => {
    const result = createCalendarName("   ");

    expect(result._unsafeUnwrap()).toBe("   ");
  });
});
