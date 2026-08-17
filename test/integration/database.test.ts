// [CORREÇÃO DE ERRO]: Carrega variáveis do .env para disponibilizar TEST_DATABASE_URL nos testes
import "dotenv/config";
import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// [CORREÇÃO DE ERRO]: Conexão com o banco isolado de testes
const connectionString = process.env.TEST_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "TEST_DATABASE_URL is required for integration tests. Use .env.example as a reference.",
  );
}

const client = new Client({ connectionString });

describe("database integration", () => {
  beforeAll(() => client.connect());

  // [CORREÇÃO DE ERRO]: afterAll fecha a conexão para não deixar processos/handles abertos
  afterAll(() => client.end());

  it("connects to the isolated test database", async () => {
    const result = await client.query<{ database: string }>(
      "SELECT current_database() AS database",
    );

    expect(result.rows[0]?.database).toBe("payflow_test");
  });
});
