import express, { type Express } from "express";
import type { Environment } from "./config/env.js";
import { createTransactionSchema } from "./modules/transactions/transaction.js";
import type { Pool } from "pg";
import crypto from "node:crypto";

type AppDependencies = {
  env: Environment;
  database: Pool;
};

export function createApp({ env, database }: AppDependencies): Express {
  const app = express();

  app.use(express.json());

  // ==========================================
  // ROTAS DE SAUDE
  // ==========================================
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
    const idempotencyKey = request.headers["idempotency-key"];

    if (!idempotencyKey || typeof idempotencyKey !== "string") {
      return response
        .status(400)
        .json({ error: "O header 'idempotency-key' é obrigatório." });
    }

    try {
      const payload = createTransactionSchema.parse(request.body);

      const transactionId = crypto.randomUUID();

      const insertQuery = `
        INSERT INTO transactions (id, merchant_id, amount, status, customer_email, idempotency_key)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const result = (await database.query(insertQuery, [
        transactionId,
        payload.merchantId,
        payload.amount,
        "PENDING",
        payload.customerEmail,
        idempotencyKey,
      ])) as { rows: unknown[] };

      return response.status(201).json(result.rows[0]);
    } catch (error: unknown) {
      const dbError = error as { code?: string };

      if (dbError.code === "23505") {
        const selectQuery = `SELECT * FROM transactions WHERE idempotency_key = $1;`;
        const existingResult = (await database.query(selectQuery, [
          idempotencyKey,
        ])) as { rows: unknown[] };

        if (existingResult.rows && existingResult.rows.length > 0) {
          return response.status(200).json(existingResult.rows[0]);
        }
      }

      if (dbError.code === "23503") {
        return response.status(400).json({ error: "MerchantNotFoundError" });
      }

      console.error(error);
      return response.status(500).json({ error: "Erro interno no servidor." });
    }
  });

  app.get("/transactions/:id", async (request, response) => {
    try {
      const { id } = request.params;

      const selectQuery = `
        SELECT 
          t.*, 
          m.name as "merchantName"
        FROM transactions t
        INNER JOIN merchants m ON t.merchant_id = m.id
        WHERE t.id = $1;
      `;

      const result = (await database.query(selectQuery, [id])) as {
        rows: unknown[];
      };
      const transaction = result.rows[0];

      if (!transaction) {
        return response.status(404).json({ error: "Transação não encontrada" });
      }

      return response.status(200).json(transaction);
    } catch (error: unknown) {
      console.error(error);
      return response.status(500).json({ error: "Erro interno no servidor." });
    }
  });

  return app;
}
