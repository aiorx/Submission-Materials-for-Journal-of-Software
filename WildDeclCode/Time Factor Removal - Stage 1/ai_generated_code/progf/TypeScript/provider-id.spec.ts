var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createProviderId = require('./provider-id').createProviderId;

// Supported via standard GitHub programming aids

describe("createProviderId", function () {
  test("should create valid provider ID for auth0", () => {
    const result = createProviderId("auth0");

    expect(result._unsafeUnwrap()).toBe("auth0");
  });

  test("should reject invalid provider ID", () => {
    const result = createProviderId("google");

    expect(result._unsafeUnwrapErr()).toBe("InvalidProviderId");
  });

  test("should reject empty string", () => {
    const result = createProviderId("");

    expect(result._unsafeUnwrapErr()).toBe("InvalidProviderId");
  });
});
