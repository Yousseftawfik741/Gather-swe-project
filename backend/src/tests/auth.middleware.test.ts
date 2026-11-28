
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import { authenticateToken } from "../middleware/auth.middleware";
import { generateAccessToken } from "../utils/token";

describe("Authentication middleware", () => {
  function createApp() {
    const app = express();

    app.use(cookieParser());

    app.get("/protected", authenticateToken, (req, res) => {
      res.json({
        success: true,
        userId: (req as express.Request & { userId?: string }).userId,
      });
    });

    return app;
  }

  it("rejects requests without an authentication cookie", async () => {
    const response = await request(createApp()).get("/protected");

    assert.equal(response.status, 401);
  });

  it("rejects invalid tokens", async () => {
    const response = await request(createApp())
      .get("/protected")
      .set("Cookie", "accessToken=invalid.token");

    assert.equal(response.status, 401);
  });

  it("accepts valid tokens from HttpOnly authentication cookies", async () => {
    process.env.JWT_SECRET = "GatherDevelopmentTestSecret123456789!";

    const token = generateAccessToken("test-user-123");

    const response = await request(createApp())
      .get("/protected")
      .set("Cookie", `accessToken=${token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.userId, "test-user-123");
  });

  it("rejects Bearer tokens without an authentication cookie", async () => {
    const token = generateAccessToken("test-user-123");

    const response = await request(createApp())
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    assert.equal(response.status, 401);
  });
});
