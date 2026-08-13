import type { Pool } from "pg";
import type { Transaction } from "./transaction.js";
import { MerchantNotFoundError } from "./transaction-errors.js";

// Tipo para o retorno do GET contendo os dados da transação + merchant
export type TransactionWithMerchant = Transaction & {
  merchantName?: string;
};

export function createTransactionStore(pool: Pool) {
  return {
    // 1. Função de Inserir
    async insertTransaction(transaction: Transaction): Promise<Transaction> {
      try {
        const result = await pool.query(
          `INSERT INTO transactions (id, merchant_id, amount, status, customer_email)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING 
              id, 
              merchant_id AS "merchantId", 
              amount, 
              status, 
              customer_email AS "customerEmail"`,
          [
            transaction.id,
            transaction.merchantId,
            transaction.amount,
            transaction.status,
            transaction.customerEmail,
          ],
        );

        return result.rows[0];
      } catch (error) {
        const pgError = error as { code?: string };

        // Código 23503 = Violação de Foreign Key no PostgreSQL
        if (pgError?.code === "23503") {
          throw new MerchantNotFoundError();
        }
        throw error;
      }
    },

    // 2. Função de Buscar
    async findTransactionById(
      id: string,
    ): Promise<TransactionWithMerchant | null> {
      const result = await pool.query(
        `SELECT 
           t.id, 
           t.merchant_id AS "merchantId", 
           t.amount, 
           t.status, 
           t.customer_email AS "customerEmail",
           m.name AS "merchantName"
         FROM transactions t
         INNER JOIN merchants m ON t.merchant_id = m.id
         WHERE t.id = $1`,
        [id],
      );

      return result.rows[0] || null;
    },
  };
}

export type TransactionStore = ReturnType<typeof createTransactionStore>;
