var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createAccountId = require('./account-id').createAccountId;

// Supported via standard GitHub programming aids

describe("createAccountId", function () {
  test("should create valid account ID", () => {
    const result = createAccountId("account-123");

    expect(result._unsafeUnwrap()).toBe("account-123");
  });

  test("should reject empty string", () => {
    const result = createAccountId("");

    expect(result._unsafeUnwrapErr()).toBe("AccountId cannot be empty");
  });
});
