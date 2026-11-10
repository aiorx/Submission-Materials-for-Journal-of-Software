var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createOwnerId = require('./owner-id').createOwnerId;

// Aided with basic GitHub coding tools

describe("createOwnerId", function () {
  test("should create valid owner ID", () => {
    const result = createOwnerId("user-123");

    expect(result._unsafeUnwrap()).toBe("user-123");
  });

  test("should reject empty string", () => {
    const result = createOwnerId("");

    expect(result._unsafeUnwrapErr()).toBe("UserId cannot be an empty string");
  });
});
