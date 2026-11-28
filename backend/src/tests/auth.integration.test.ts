
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app";
import { prisma } from "../config/database";

describe("Authentication integration", () => {
  const email = `auth-${crypto.randomUUID()}@example.com`;
  const password = "GatherSecurePassword123!";

  before(() => {
    process.env.JWT_SECRET =
      "GatherDevelopmentTestSecret123456789!";
  });

  after(async () => {
    await prisma.user.deleteMany({
      where: { email },
    });
  });

  it("registers a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Omar",
        lastName: "Test",
        email,
        password,
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.user.email, email);
    assert.ok(response.headers["set-cookie"]);
  });

  it("rejects duplicate email registration", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Omar",
        lastName: "Duplicate",
        email,
        password,
      });

    assert.equal(response.status, 409);
  });

  it("logs in an existing user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.ok(response.headers["set-cookie"]);
  });

  it("rejects incorrect passwords", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "WrongPassword123!",
      });

    assert.equal(response.status, 401);
  });

  it("rejects invalid registration data", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "invalid-email",
        password: "123",
      });

    assert.equal(response.status, 400);
  });

  it("logs out an authenticated user", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    const cookies = loginResponse.headers["set-cookie"];

    assert.ok(cookies);

    const response = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
  });
});
