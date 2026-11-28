
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app";
import { prisma } from "../config/database";
import { generateAccessToken } from "../utils/token";

describe("GET /api/auth/me", () => {
  const testEmail = `auth-me-${crypto.randomUUID()}@example.com`;

  let activeUserId: string;
  let inactiveUserId: string;

  before(async () => {
    process.env.JWT_SECRET = "GatherDevelopmentTestSecret123456789!";

    const activeUser = await prisma.user.create({
      data: {
        firstName: "Test",
        lastName: "Active",
        email: testEmail,
        passwordHash: "test-hash",
      },
    });

    const inactiveUser = await prisma.user.create({
      data: {
        firstName: "Test",
        lastName: "Inactive",
        email: `inactive-${testEmail}`,
        passwordHash: "test-hash",
        isActive: false,
      },
    });

    activeUserId = activeUser.id;
    inactiveUserId = inactiveUser.id;
  });

  after(async () => {
    if (activeUserId && inactiveUserId) {
      await prisma.user.deleteMany({
        where: {
          id: {
            in: [activeUserId, inactiveUserId],
          },
        },
      });
    }
  });

  it("rejects requests without authentication cookies", async () => {
    const response = await request(app).get("/api/auth/me");

    assert.equal(response.status, 401);
  });

  it("rejects invalid authentication cookies", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", "accessToken=invalid.token");

    assert.equal(response.status, 401);
  });

  it("returns the authenticated user's information", async () => {
    const token = generateAccessToken(activeUserId);

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `accessToken=${token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.user.id, activeUserId);
    assert.equal(response.body.data.user.email, testEmail);
    assert.equal(response.body.data.user.isActive, undefined);
  });

  it("rejects inactive accounts", async () => {
    const token = generateAccessToken(inactiveUserId);

    const response = await request(app)
      .get("/api/auth/me")
      .set("Cookie", `accessToken=${token}`);

    assert.equal(response.status, 401);
    assert.equal(response.body.message, "User account is unavailable");
  });
});
