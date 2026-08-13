import express, { type Express } from "express";
import type { Environment } from "./config/env.js";
import { createTransactionSchema } from "./modules/transactions/transaction.js";
import { createTransactionStore } from "./modules/transactions/transaction-store.js";
import { createTransactionService } from "./modules/transactions/create-transaction.js";
import { MerchantNotFoundError } from "./modules/transactions/transaction-errors.js";
import type { Pool } from "pg";

type AppDependencies = {
  env: Environment;
  database: Pool;
};

export function createApp({ env, database }: AppDependencies): Express {
  const app = express();

  app.use(express.json());

  const transactionStore = createTransactionStore(database);
  const createTransaction = createTransactionService(transactionStore);

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

  // ==========================================
  // ROTAS DE TRANSAÇÕES
  // ==========================================

  app.post("/transactions", async (request, response) => {
    try {
      const validationResult = createTransactionSchema.safeParse(request.body);

      if (!validationResult.success) {
        return response.status(400).json({
          error: "Dados inválidos",
          details: validationResult.error.format(),
        });
      }

      const transaction = await createTransaction(validationResult.data);
      return response.status(201).json(transaction);
    } catch (error) {
      if (error instanceof MerchantNotFoundError) {
        return response.status(400).json({ error: "Merchant não encontrado" });
      }

      if (error instanceof Error && error.message.includes("maior que zero")) {
        return response.status(400).json({ error: error.message });
      }

      const message = error instanceof Error ? error.message : "Unknown error";
      return response.status(500).json({ error: message });
    }
  });

  app.get("/transactions/:id", async (request, response) => {
    try {
      const { id } = request.params;
      const transaction = await transactionStore.findTransactionById(id);

      if (!transaction) {
        return response.status(404).json({ error: "Transação não encontrada" });
      }

      return response.json(transaction);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return response.status(500).json({ error: message });
    }
  });

  return app;
}
