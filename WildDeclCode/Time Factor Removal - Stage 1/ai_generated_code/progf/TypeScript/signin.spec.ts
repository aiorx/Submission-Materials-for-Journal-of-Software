// Aided with basic GitHub coding tools
var errAsync = require('neverthrow').errAsync;
var okAsync = require('neverthrow').okAsync;
var describe = require('vitest').describe;
var expect = require('vitest').expect;
var it = require('vitest').it;
var vi = require('vitest').vi;

import {
  AuthError,
  DBError,
  EntityNotFound,
  ValidationError,
} from "../../../shared/errors";
import {
  type Provider,
  signinWorkflow,
  toUnvalidatedSigninCommand,
} from "./signin";

// Mock providers and dependencies
var createMockProvider = (overrides: Partial<Provider> = {}): function Provider { return ({
  providerId: "auth0",
  exchangeCodeForToken: vi.fn().mockReturnValue(
    okAsync({
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      expiresIn: 3600,
    }),
  ),
  verifyIdToken: vi.fn().mockReturnValue(okAsync(undefined)),
  getUserInfo: vi.fn().mockReturnValue(
    okAsync({
      id: "user123",
      name: "John Doe",
      email: "john@example.com",
      emailVerified: true,
    }),
  ),
  ...overrides,
}); };

var createMockFindOauth2User = function (shouldFind = false) {
  if (shouldFind) {
    return vi.fn().mockReturnValue(
      okAsync({
        user: {
          id: "existing-user-id",
          name: "John Doe",
          email: "john@example.com",
        },
        account: {
          account_id: "user123",
          user_id: "existing-user-id",
          provider_id: "auth0",
        },
      }),
    );
  }
  return vi
    .fn()
    .mockReturnValue(errAsync(new EntityNotFound("User not found")));
};

var createMockSaveOauthUser = function () {
  return vi.fn().mockReturnValue(okAsync(undefined));
};

describe("Signin Workflow", function () {
  describe("toUnvalidatedSigninCommand", () => {
    it("should create an unvalidated signin command", () => {
      var input = {
        code: "valid_code",
        code_verifier: "a".repeat(43),
      };

      var command = toUnvalidatedSigninCommand(input);

      expect(command).toEqual({
        kind: "unvalidated",
        input,
      });
    });
  });

  describe("signinWorkflow - successful flow", () => {
    it("should complete signin workflow for new user", async () => {
      var provider = createMockProvider();
      var findOauth2User = createMockFindOauth2User(false);
      var saveOauthUser = createMockSaveOauthUser();
      var clientId = "test-client-id";

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        clientId,
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isOk()).toBeTruthy();
      var sessionIssued = result._unsafeUnwrap();
      expect(sessionIssued.kind).toBe("session_issued");
      expect(sessionIssued.session).toMatchObject({
        id: expect.any(String),
        user_id: expect.any(String),
        expires_at: expect.any(Date),
        max_age: expect.any(Number),
      });

      // Verify all functions were called
      expect(provider.exchangeCodeForToken).toHaveBeenCalled();
      expect(provider.verifyIdToken).toHaveBeenCalled();
      expect(provider.getUserInfo).toHaveBeenCalled();
      expect(findOauth2User).toHaveBeenCalled();
      expect(saveOauthUser).toHaveBeenCalled();
    });

    it("should complete signin workflow for existing user", async () => {
      var provider = createMockProvider();
      var findOauth2User = createMockFindOauth2User(true);
      var saveOauthUser = createMockSaveOauthUser();
      var clientId = "test-client-id";

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        clientId,
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isOk()).toBeTruthy();
      var sessionIssued = result._unsafeUnwrap();
      expect(sessionIssued.kind).toBe("session_issued");
      expect(sessionIssued.session.user_id).toBe("existing-user-id");

      // Verify saveOauthUser was not called for existing user
      expect(saveOauthUser).not.toHaveBeenCalled();
    });
  });

  describe("signinWorkflow - validation errors", () => {
    it("should fail with validation error for invalid code", async () => {
      var provider = createMockProvider();
      var findOauth2User = createMockFindOauth2User();
      var saveOauthUser = createMockSaveOauthUser();

      var command = toUnvalidatedSigninCommand({
        code: "", // Invalid empty code
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(ValidationError);
    });

    it("should fail with validation error for invalid code verifier", async () => {
      var provider = createMockProvider();
      var findOauth2User = createMockFindOauth2User();
      var saveOauthUser = createMockSaveOauthUser();

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "short", // Too short
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(ValidationError);
    });

    it("should fail with validation error for invalid user data from provider", async () => {
      var provider = createMockProvider({
        getUserInfo: vi.fn().mockReturnValue(
          okAsync({
            id: "user123",
            name: "", // Invalid empty name
            email: "john@example.com",
            emailVerified: true, // Keep email verified to avoid early failure
          }),
        ),
      });
      var findOauth2User = createMockFindOauth2User();
      var saveOauthUser = createMockSaveOauthUser();

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(ValidationError);
    });
  });

  describe("signinWorkflow - token exchange errors", () => {
    it("should fail when token exchange fails", async () => {
      var provider = createMockProvider({
        exchangeCodeForToken: vi
          .fn()
          .mockReturnValue(errAsync(new Error("Token exchange failed"))),
      });
      var findOauth2User = createMockFindOauth2User();
      var saveOauthUser = createMockSaveOauthUser();

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(AuthError);
      expect(error.message).toContain("Failed to get credentials");
    });
  });

  describe("signinWorkflow - token verification errors", () => {
    it("should fail when ID token verification fails", async () => {
      var provider = createMockProvider({
        verifyIdToken: vi
          .fn()
          .mockReturnValue(errAsync(new Error("Token verification failed"))),
      });
      var findOauth2User = createMockFindOauth2User();
      var saveOauthUser = createMockSaveOauthUser();

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(AuthError);
      expect(error.message).toContain("verifying the idToken");
    });

    it("should fail when email is not verified", async () => {
      var provider = createMockProvider({
        getUserInfo: vi.fn().mockReturnValue(
          okAsync({
            id: "user123",
            name: "John Doe",
            email: "john@example.com",
            emailVerified: false, // Email not verified
          }),
        ),
      });
      var findOauth2User = createMockFindOauth2User();
      var saveOauthUser = createMockSaveOauthUser();

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(AuthError);
      expect(error.message).toContain("Email is not verified");
    });

    it("should fail when getUserInfo fails", async () => {
      var provider = createMockProvider({
        getUserInfo: vi
          .fn()
          .mockReturnValue(errAsync(new Error("Failed to get user info"))),
      });
      var findOauth2User = createMockFindOauth2User();
      var saveOauthUser = createMockSaveOauthUser();

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain("Failed to get user info");
    });
  });

  describe("signinWorkflow - database errors", () => {
    it("should fail when database find operation fails with DBError", async () => {
      var provider = createMockProvider(); // Uses default with emailVerified: true
      var findOauth2User = vi
        .fn()
        .mockReturnValue(errAsync(new DBError("Database connection failed")));
      var saveOauthUser = createMockSaveOauthUser();

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DBError);
    });

    it("should fail when save operation fails", async () => {
      var provider = createMockProvider(); // Uses default with emailVerified: true
      var findOauth2User = createMockFindOauth2User(false);
      var saveOauthUser = vi
        .fn()
        .mockReturnValue(errAsync(new DBError("Failed to save user")));

      var command = toUnvalidatedSigninCommand({
        code: "valid_code",
        code_verifier: "a".repeat(43),
      });

      var workflow = signinWorkflow(
        "client-id",
        provider,
        findOauth2User,
        saveOauthUser,
      );
      var result = await workflow(command);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DBError);
    });
  });

  describe("signinWorkflow - provider integration", () => {
    it("should pass correct parameters to provider methods", async () => {
      var provider = createMockProvider();
      var findOauth2User = createMockFindOauth2User(false);
      var saveOauthUser = createMockSaveOauthUser();
      var clientId = "test-client-id";

      var command = toUnvalidatedSigninCommand({
        code: "test_code",
        code_verifier: "a".repeat(50),
      });

      var workflow = signinWorkflow(
        clientId,
        provider,
        findOauth2User,
        saveOauthUser,
      );
      await workflow(command);

      // Verify exchangeCodeForToken was called with correct parameters
      expect(provider.exchangeCodeForToken).toHaveBeenCalledWith(
        "test_code",
        "a".repeat(50),
      );

      // Verify verifyIdToken was called with correct parameters
      expect(provider.verifyIdToken).toHaveBeenCalledWith("id_token", {
        audience: clientId,
        expirationTime: 3600,
      });

      // Verify getUserInfo was called with tokens
      expect(provider.getUserInfo).toHaveBeenCalledWith({
        idToken: "id_token",
        accessToken: "access_token",
        refreshToken: "refresh_token",
        expiresIn: 3600,
      });
    });
  });
});
