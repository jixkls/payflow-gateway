// [CORREÇÃO DE ERRO]: Carrega variáveis do arquivo .env no ambiente de testes
import "dotenv/config";
import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { loadEnvironment } from "../../src/config/env";
import { createDatabasePool } from "../../src/shared/database";

const env = loadEnvironment();

// [CORREÇÃO DE ERRO 5]: Configurado o uso do TEST_DATABASE_URL para usar o banco isolado de testes
// em vez de apontar para o banco de desenvolvimento
const connectionString = process.env.TEST_DATABASE_URL || env.DATABASE_URL;
const database = createDatabasePool(connectionString);

describe("Testes de Regressão - Hardening do Fluxo (Task 12)", () => {
  const app = createApp({ env, database });

  // [CORREÇÃO DE ERRO 6]: afterAll fecha o pool de conexões com o banco após a execução dos testes
  // para evitar processos ou conexões abertas
  afterAll(async () => {
    await database.end();
  });

  it("deve retornar 404 ao tentar criar transação para um lojista inexistente", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Idempotency-Key", "uuid-inexistente-123")
      .send({
        merchant_id: "00000000-0000-0000-0000-000000000000",
        amount: 100.0,
        customer_email: "test@example.com",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("deve retornar 400 ao tentar criar transação com valor menor ou igual a zero", async () => {
    const response = await request(app)
      .post("/transactions")
      .set("Idempotency-Key", "uuid-valor-invalido")
      .send({
        merchant_id: "algum-id-valido",
        amount: -50.0,
        customer_email: "test@example.com",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O valor da transação deve ser maior que zero.",
    );
  });

  it("deve retornar 404 ao buscar uma transação que não existe", async () => {
    const response = await request(app).get("/transactions/uuid-falso-999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
