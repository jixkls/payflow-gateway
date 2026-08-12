import type { Transaction } from "./transaction.js";

export async function loadPaidTransactions(): Promise<string[]> {
  const response = await fetch("/transactions");

  if (!response.ok) {
    throw new Error(`Erro ao buscar transações. Status: ${response.status}`);
  }

  const transactions = (await response.json()) as Transaction[];

  return transactions
    .filter((tx) => tx.status === "PAID" && tx.customerEmail != null)
    .map((tx) => {
      const formattedAmount = (tx.amount / 100).toFixed(2);

      return `${tx.id} | R$ ${formattedAmount} | ${tx.customerEmail}`;
    });
}
