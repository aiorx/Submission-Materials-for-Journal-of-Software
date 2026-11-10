var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createUserName = require('./name').createUserName;
var MAX_USER_NAME_LENGTH = require('./name').MAX_USER_NAME_LENGTH;

// Aided with basic GitHub coding tools

describe("createUserName", function () {
  test("should create valid user name", () => {
    const result = createUserName("John Doe");

    expect(result._unsafeUnwrap()).toBe("John Doe");
  });

  test("should reject empty string", () => {
    const result = createUserName("");

    expect(result._unsafeUnwrapErr()).toBe("User name cannot be empty.");
  });

  test("should accept name at maximum length", () => {
    const maxLengthName = "a".repeat(MAX_USER_NAME_LENGTH);
    const result = createUserName(maxLengthName);

    expect(result._unsafeUnwrap()).toBe(maxLengthName);
  });

  test("should reject name exceeding maximum length", () => {
    const tooLongName = "a".repeat(MAX_USER_NAME_LENGTH + 1);
    const result = createUserName(tooLongName);

    expect(result._unsafeUnwrapErr()).toBe(
      "User name exceeds maximum length of " + (MAX_USER_NAME_LENGTH) + " characters.",
    );
  });
});
