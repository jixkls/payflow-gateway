import express, { type Express } from "express";
import type { Pool } from "pg";
import type { Environment } from "./config/env.js";

type AppDependencies = {
  env: Environment;
  database: Pool;
};

export function createApp({ env, database }: AppDependencies): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "payflow-gateway",
      version: env.APP_VERSION,
    });
  });

  app.get("/health/database", async (_request, response) => {
    try {
      await database.query("SELECT 1");
      response.json({ status: "ok", database: "connected" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      response.status(503).json({ status: "error", database: message });
    }
  });

  return app;
}
