var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createSessionId = require('./session-id').createSessionId;
var generateSessionId = require('./session-id').generateSessionId;

// Supported via standard GitHub programming aids

describe("createSessionId", function () {
  test("should create valid session ID", () => {
    const result = createSessionId("session-123");

    expect(result._unsafeUnwrap()).toBe("session-123");
  });

  test("should reject null value", () => {
    const result = createSessionId(null);

    expect(result._unsafeUnwrapErr()).toBe("InvalidSessionId");
  });

  test("should reject undefined value", () => {
    const result = createSessionId(undefined as unknown as null);

    expect(result._unsafeUnwrapErr()).toBe("InvalidSessionId");
  });

  test("should reject empty string", () => {
    const result = createSessionId("");

    expect(result._unsafeUnwrapErr()).toBe("InvalidSessionId");
  });
});

describe("generateSessionId", function () {
  test("should generate unique session IDs", () => {
    const id1 = generateSessionId();
    const id2 = generateSessionId();

    expect(id1).not.toBe(id2);
  });
});
