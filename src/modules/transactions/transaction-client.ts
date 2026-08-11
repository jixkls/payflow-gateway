import type { Transaction } from "./transaction.js";

export async function getTransaction(id: string): Promise<Transaction> {
  const response = await fetch(`/transactions/${id}`);
  const transaction = (await response.json()) as Transaction;

  return transaction;
}
