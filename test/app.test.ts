import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";
import type { Environment } from "../src/config/env.js";

const env: Environment = {
  PORT: 3000,
  APP_VERSION: "test",
  DATABASE_URL: "postgresql://localhost/test",
};

describe("health endpoints", () => {
  it("reports that the service is available", async () => {
    const database = { query: vi.fn() };
    const app = createApp({ env, database });

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "payflow-gateway",
      version: "test",
    });
  });

  it("reports a successful database connection", async () => {
    const database = { query: vi.fn().mockResolvedValue({ rows: [] }) };
    const app = createApp({ env, database });

    const response = await request(app).get("/health/database");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", database: "connected" });
  });

  it("reports an unavailable database", async () => {
    const database = { query: vi.fn().mockRejectedValue(new Error("offline")) };
    const app = createApp({ env, database });

    const response = await request(app).get("/health/database");

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: "error", database: "offline" });
  });
});
