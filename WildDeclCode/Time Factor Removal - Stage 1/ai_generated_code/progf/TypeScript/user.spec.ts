var describe = require('vitest').describe;
var expect = require('vitest').expect;
var test = require('vitest').test;

var createUser = require('./user').createUser;

// Aided with basic GitHub coding tools

describe("createUser", function () {
  test("should create valid user", () => {
    const userData = {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
    };

    const result = createUser(userData);

    const user = result._unsafeUnwrap();
    expect(user.id).toBe("user-123");
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
  });

  test("should reject invalid email", () => {
    const userData = {
      id: "user-123",
      name: "John Doe",
      email: "invalid-email",
    };

    const result = createUser(userData);

    const errors = result._unsafeUnwrapErr();
    expect(errors).toContain("Invalid email.");
  });
});
