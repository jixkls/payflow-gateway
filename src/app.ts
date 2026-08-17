import express, { type Express } from "express";
import { ZodError } from "zod";
import type { Pool } from "pg";
import type { Environment } from "./config/env.js";

import { createMerchantSchema } from "./modules/merchants/merchant.js";
import { createMerchantStore } from "./modules/merchants/merchant-store.js";
import { createMerchantService } from "./modules/merchants/create-merchant.js";
import { EmailAlreadyExistsError } from "./modules/merchants/merchant-errors.js";

type AppDependencies = {
  env: Environment;
  database: Pool;
};

export function createApp({ env, database }: AppDependencies): Express {
  const app = express();
  app.use(express.json());

  const merchantStore = createMerchantStore(database);
  const createMerchant = createMerchantService(merchantStore);

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "payflow-gateway",
      training: "git-conflict",
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

  app.post("/merchants", async (request, response) => {
    try {
      const data = createMerchantSchema.parse(request.body);
      const newMerchant = await createMerchant(data);
      response.status(201).json(newMerchant);
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          error: "Dados inválidos",
          details: error.issues,
        });
        return;
      }

      if (error instanceof EmailAlreadyExistsError) {
        response.status(409).json({
          error: "Este e-mail já está em uso.",
        });
        return;
      }

      response.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/merchants/:id", async (request, response) => {
    try {
      const { id } = request.params;
      const merchant = await merchantStore.findMerchantById(id);

      if (!merchant) {
        response.status(404).json({ error: "Estabelecimento não encontrado." });
        return;
      }

      response.json(merchant);
    } catch {
      response.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return app;
}
