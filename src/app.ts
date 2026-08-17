import express, { type Express } from "express";
import type { Environment } from "./config/env.js";
import type { Pool } from "pg";
import crypto from "node:crypto";
import { ZodError } from "zod";
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

  // ==========================================
  // ROTAS DE TRANSAÇÕES
  // ==========================================

  app.post("/transactions", async (request, response) => {
    const idempotencyKey = request.headers["idempotency-key"];
    const { merchant_id, amount, customer_email } = request.body;

    // 1. LOG DE INÍCIO: Registra a intenção sem expor dados sensíveis
    console.info(
      `[Transação] Iniciando processamento. Merchant ID: ${merchant_id || "N/A"}, Valor: ${amount}`,
    );

    // 2. VALIDAÇÕES DE NEGÓCIO (Fail-Fast)
    if (!idempotencyKey) {
      console.warn(
        `[Transação] Falha na validação: Idempotency-Key ausente. Merchant: ${merchant_id}`,
      );
      return response
        .status(400)
        .json({ error: "O header Idempotency-Key é obrigatório." });
    }

    if (!amount || amount <= 0) {
      console.warn(
        `[Transação] Falha na validação: Valor inválido (${amount}). Merchant: ${merchant_id}`,
      );
      return response
        .status(400)
        .json({ error: "O valor da transação deve ser maior que zero." });
    }

    try {
      const id = crypto.randomUUID();

      // [CORREÇÃO DE ERRO 1]: A tabela transactions exige que a coluna "status" seja NOT NULL.
      // Adicionado o valor inicial 'PENDING' diretamente na query de inserção para evitar erro 23502.
      const insertQuery = `
        INSERT INTO transactions (id, merchant_id, amount, status, customer_email, idempotency_key)
        VALUES ($1, $2, $3, 'PENDING', $4, $5)
        RETURNING *;
      `;

      const result = (await database.query(insertQuery, [
        id,
        merchant_id,
        amount,
        customer_email ?? null,
        idempotencyKey,
      ])) as { rows: unknown[] };

      // 3. LOG DE SUCESSO
      console.info(
        `[Transação] Sucesso: Transação ${id} criada para o Merchant ${merchant_id}.`,
      );
      return response.status(201).json(result.rows[0]);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };

      // [CORREÇÃO DE ERRO 2]: Tratamento controlado de erro do banco para Idempotência (código 23505 - unique_violation).
      // Retorna 200 com a transação existente em vez de estourar erro 500.
      if (error.code === "23505") {
        console.info(
          `[Transação] Idempotência ativada. Retornando transação existente para a chave informada.`,
        );
        const selectQuery = `SELECT * FROM transactions WHERE idempotency_key = $1;`;
        const existingResult = (await database.query(selectQuery, [
          idempotencyKey,
        ])) as { rows: unknown[] };
        return response.status(200).json(existingResult.rows[0]);
      }

      // [CORREÇÃO DE ERRO 3]: Tratamento controlado de erro de Foreign Key (código 23503 - foreign_key_violation).
      // Retorna 404 (Lojista não encontrado) em vez de retornar 500 ou vazar stack trace.
      if (error.code === "23503") {
        console.warn(
          `[Transação] Falha estrutural: Tentativa de transação para Merchant inexistente (${merchant_id}).`,
        );
        return response
          .status(404)
          .json({ error: "Lojista (Merchant) não encontrado." });
      }

      // [CORREÇÃO DE ERRO 4]: Tratamento de erros inesperados — registra o erro nos logs internos do servidor,
      // mas retorna mensagem HTTP 500 genérica, sem expor detalhes internos da infraestrutura ao cliente.
      console.error(
        `[Transação] Erro inesperado ao processar transação. ` +
          `Merchant: ${merchant_id}, Code: ${error.code ?? "N/A"}, Message: ${error.message ?? "N/A"}`,
      );

      return response.status(500).json({
        error: "Ocorreu um erro interno no servidor ao processar a transação.",
      });
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
      const err = error as { code?: string; message?: string };
      console.error(
        `[Transação] Erro inesperado ao buscar transação. Code: ${err.code ?? "N/A"}, Message: ${err.message ?? "N/A"}`,
      );
      return response.status(500).json({ error: "Erro interno no servidor." });
    }
  });

  return app;
}
