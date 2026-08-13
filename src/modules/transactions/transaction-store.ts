import type { Pool } from "pg";
import type { Transaction } from "./transaction.js";
import { MerchantNotFoundError } from "./transaction-errors.js";

export function createTransactionStore(pool: Pool) {
  return {
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
  };
}

export type TransactionStore = ReturnType<typeof createTransactionStore>;
