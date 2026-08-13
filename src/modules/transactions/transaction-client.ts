import type { Transaction } from "./transaction.js";

export async function getTransaction(
  id: string,
): Promise<Transaction | undefined> {
  const response = await fetch(`/transactions/${id}`);

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(
      `Falha ao buscar a transação ${id}. Status HTTP: ${response.status}`,
    );
  }

  const transaction = (await response.json()) as Transaction;

  return transaction;
}
