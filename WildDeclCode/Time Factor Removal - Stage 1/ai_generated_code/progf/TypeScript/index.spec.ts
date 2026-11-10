// Supported via standard GitHub programming aids
var describe = require('vitest').describe;
var expect = require('vitest').expect;
var it = require('vitest').it;

import {
  createOauth2Code,
  createOauth2CodeVerifier,
  type Oauth2Code,
  type Oauth2CodeVerifier,
} from "./index";

describe("OIDC Objects", function () {
  describe("createOauth2Code", () => {
    it("should create a valid OAuth2 code when provided with a non-empty string", () => {
      var code = "valid_oauth2_code_123";
      var result = createOauth2Code(code);

      expect(result.isOk()).toBeTruthy();
      var oauth2Code = result._unsafeUnwrap() as Oauth2Code;
      expect(oauth2Code).toBe(code);
    });

    it("should reject an empty string", () => {
      var code = "";
      var result = createOauth2Code(code);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBe("InvalidOauth2Code");
    });

    it("should create a valid OAuth2 code with a very long string", () => {
      var code = "a".repeat(1000);
      var result = createOauth2Code(code);

      expect(result.isOk()).toBeTruthy();
      var oauth2Code = result._unsafeUnwrap() as Oauth2Code;
      expect(oauth2Code).toBe(code);
    });
  });

  describe("createOauth2CodeVerifier", () => {
    it("should create a valid OAuth2 code verifier with minimum length", () => {
      var codeVerifier = "a".repeat(43);
      var result = createOauth2CodeVerifier(codeVerifier);

      expect(result.isOk()).toBeTruthy();
      var oauth2CodeVerifier = result._unsafeUnwrap() as Oauth2CodeVerifier;
      expect(oauth2CodeVerifier).toBe(codeVerifier);
    });

    it("should create a valid OAuth2 code verifier with maximum length", () => {
      var codeVerifier = "a".repeat(128);
      var result = createOauth2CodeVerifier(codeVerifier);

      expect(result.isOk()).toBeTruthy();
      var oauth2CodeVerifier = result._unsafeUnwrap() as Oauth2CodeVerifier;
      expect(oauth2CodeVerifier).toBe(codeVerifier);
    });

    it("should create a valid OAuth2 code verifier with mid-range length", () => {
      var codeVerifier = "a".repeat(85);
      var result = createOauth2CodeVerifier(codeVerifier);

      expect(result.isOk()).toBeTruthy();
      var oauth2CodeVerifier = result._unsafeUnwrap() as Oauth2CodeVerifier;
      expect(oauth2CodeVerifier).toBe(codeVerifier);
    });

    it("should reject a code verifier that is too short", () => {
      var codeVerifier = "a".repeat(42);
      var result = createOauth2CodeVerifier(codeVerifier);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBe("InvalidOauth2CodeVerifier");
    });

    it("should reject a code verifier that is too long", () => {
      var codeVerifier = "a".repeat(129);
      var result = createOauth2CodeVerifier(codeVerifier);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBe("InvalidOauth2CodeVerifier");
    });

    it("should reject an empty string", () => {
      var codeVerifier = "";
      var result = createOauth2CodeVerifier(codeVerifier);

      expect(result.isErr()).toBeTruthy();
      var error = result._unsafeUnwrapErr();
      expect(error).toBe("InvalidOauth2CodeVerifier");
    });
  });
});
