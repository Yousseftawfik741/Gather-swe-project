import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import errorHandler from "../middleware/error.middleware";

describe("Centralized error handling", () => {
  const app = express();

  app.get("/client-error", (_req, _res, next) => {
    next(Object.assign(new Error("Invalid request"), { status: 400 }));
  });

  app.get("/server-error", (_req, _res, next) => {
    next(new Error("Sensitive internal details"));
  });

  app.use(errorHandler);

  it("returns consistent client error responses", async () => {
    const response = await request(app).get("/client-error");

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      success: false,
      message: "Invalid request",
    });
  });

  it("hides internal server error details", async () => {
    const response = await request(app).get("/server-error");

    assert.equal(response.status, 500);
    assert.deepEqual(response.body, {
      success: false,
      message: "Internal server error",
    });
  });
});