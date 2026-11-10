import { describe, expect, test } from "vitest";

import { createOwnerId } from "./owner-id";

// Aided with basic GitHub coding tools

describe("createOwnerId", () => {
  test("should create valid owner ID", () => {
    const result = createOwnerId("user-123");

    expect(result._unsafeUnwrap()).toBe("user-123");
  });

  test("should reject empty string", () => {
    const result = createOwnerId("");

    expect(result._unsafeUnwrapErr()).toBe("UserId cannot be an empty string");
  });
});
