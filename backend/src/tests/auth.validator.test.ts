import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { registerSchema, loginSchema } from "../validators/auth.validator";

describe("Authentication validation", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      firstName: "Omar",
      lastName: "Hatem",
      email: "omar@example.com",
      password: "SecurePass123",
    });

    assert.equal(result.success, true);
  });

  it("rejects invalid registration email", () => {
    const result = registerSchema.safeParse({
      firstName: "Omar",
      lastName: "Hatem",
      email: "invalid-email",
      password: "SecurePass123",
    });

    assert.equal(result.success, false);
  });

  it("rejects registration passwords shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      firstName: "Omar",
      lastName: "Hatem",
      email: "omar@example.com",
      password: "1234567",
    });

    assert.equal(result.success, false);
  });

  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "omar@example.com",
      password: "password123",
    });

    assert.equal(result.success, true);
  });

  it("rejects empty login passwords", () => {
    const result = loginSchema.safeParse({
      email: "omar@example.com",
      password: "",
    });

    assert.equal(result.success, false);
  });

  it("normalizes email addresses", () => {
    const result = loginSchema.safeParse({
      email: "  OMAR@EXAMPLE.COM  ",
      password: "password123",
    });

    assert.equal(result.success, true);

    if (result.success) {
      assert.equal(result.data.email, "omar@example.com");
    }
  });
});
