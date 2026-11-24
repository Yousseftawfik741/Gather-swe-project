
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { authenticateToken } from "../middleware/auth.middleware";
import { generateAccessToken } from "../utils/token";

describe("Authentication middleware", () => {
  it("rejects requests without a token", async () => {
    const app = express();

    app.get("/protected", authenticateToken, (_req, res) => {
      res.json({ success: true });
    });

    const response = await request(app).get("/protected");

    assert.equal(response.status, 401);
  });

  it("rejects invalid tokens", async () => {
    const app = express();

    app.get("/protected", authenticateToken, (_req, res) => {
      res.json({ success: true });
    });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid.token");

    assert.equal(response.status, 401);
  });

  it("accepts valid tokens", async () => {
    process.env.JWT_SECRET = "GatherDevelopmentTestSecret123456789!";

    const app = express();

    app.get("/protected", authenticateToken, (req, res) => {
      res.json({
        success: true,
        userId: (req as express.Request & { userId?: string }).userId,
      });
    });

    const token = generateAccessToken("test-user-123");

    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.userId, "test-user-123");
  });
});
