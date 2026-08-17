import type { Pool } from "pg";
import type { Merchant } from "./merchant.js";
import { EmailAlreadyExistsError } from "./merchant-errors.js";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

export function createMerchantStore(pool: Pool) {
  return {
    async findMerchantByEmail(email: string): Promise<Merchant | null> {
      const result = await pool.query(
        "SELECT * FROM merchants WHERE email = $1",
        [email],
      );
      return result.rows[0] || null;
    },

    async findMerchantById(id: string): Promise<Merchant | null> {
      const result = await pool.query("SELECT * FROM merchants WHERE id = $1", [
        id,
      ]);
      return result.rows[0] || null;
    },

    async insertMerchant(merchant: Merchant): Promise<Merchant> {
      try {
        const result = await pool.query(
          `INSERT INTO merchants (id, name, email, active)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [merchant.id, merchant.name, merchant.email, merchant.active],
        );
        return result.rows[0];
      } catch (error) {
        if (isUniqueViolation(error)) {
          throw new EmailAlreadyExistsError();
        }
        throw error;
      }
    },
  };
}

export type MerchantStore = ReturnType<typeof createMerchantStore>;
