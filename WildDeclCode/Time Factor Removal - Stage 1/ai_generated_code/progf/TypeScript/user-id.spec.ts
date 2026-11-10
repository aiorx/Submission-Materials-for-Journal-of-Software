var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createUserId = require('./user-id').createUserId;
var generateUserId = require('./user-id').generateUserId;

// Aided with basic GitHub coding tools

describe("createUserId", function () {
  test("should create valid user ID", () => {
    const result = createUserId("user-123");

    expect(result._unsafeUnwrap()).toBe("user-123");
  });

  test("should reject empty string", () => {
    const result = createUserId("");

    expect(result._unsafeUnwrapErr()).toBe("InvalidUserId");
  });
});

describe("generateUserId", function () {
  test("should generate unique user IDs", () => {
    const id1 = generateUserId();
    const id2 = generateUserId();

    expect(id1).not.toBe(id2);
  });
});
