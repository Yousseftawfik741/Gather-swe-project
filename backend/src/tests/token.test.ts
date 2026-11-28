
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  verifyAccessToken,
} from "../utils/token";

const validSecret = "GatherDevelopmentTestSecret123456789!";

describe("JWT utilities", () => {
  it("generates and verifies a valid token", () => {
    process.env.JWT_SECRET = validSecret;

    const token = generateAccessToken("test-user-123");

    assert.equal(verifyAccessToken(token), "test-user-123");
  });

  it("rejects expired tokens", () => {
    process.env.JWT_SECRET = validSecret;

    const token = jwt.sign(
      { sub: "test-user-123" },
      validSecret,
      { expiresIn: "-1s", algorithm: "HS256" },
    );

    assert.equal(verifyAccessToken(token), null);
  });

  it("rejects tokens signed with an unsupported algorithm", () => {
    process.env.JWT_SECRET = validSecret;

    const token = jwt.sign(
      { sub: "test-user-123" },
      validSecret,
      { algorithm: "HS384" },
    );

    assert.equal(verifyAccessToken(token), null);
  });

  it("rejects a missing JWT secret when generating a token", () => {
    delete process.env.JWT_SECRET;

    assert.throws(() => generateAccessToken("test-user-123"));
  });

  it("rejects a weak JWT secret when generating a token", () => {
    process.env.JWT_SECRET = "weak-secret";

    assert.throws(() => generateAccessToken("test-user-123"));
  });

  it("rejects verification when the JWT secret is missing", () => {
    delete process.env.JWT_SECRET;

    assert.equal(verifyAccessToken("invalid.token"), null);
  });
});
