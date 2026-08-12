import type { Transaction } from "./transaction.js";

export const transactions: Transaction[] = [
  {
    id: "tx_001",
    merchantId: "merchant_001",
    amount: 100,
    status: "PAID",
    customerEmail: "ana@email.com",
  },
  {
    id: "tx_002",
    merchantId: "merchant_001",
    amount: 500,
    status: "FAILED",
    customerEmail: "carlos@email.com",
  },
  {
    id: "tx_003",
    merchantId: "merchant_001",
    amount: 250,
    status: "PAID",
    customerEmail: null,
  },
  {
    id: "tx_004",
    merchantId: "merchant_002",
    amount: 400,
    status: "PAID",
    customerEmail: "maria@email.com",
  },
];

export function getPaidTransactions(): Transaction[] {
  return transactions.filter((transaction) => transaction.status === "PAID");
}

export function getPaidTransactionIds(): string[] {
  return transactions
    .filter((transaction) => transaction.status === "PAID")
    .map((transaction) => transaction.id);
}

export function getPaidTransactionTotal(): number {
  return transactions
    .filter((transaction) => transaction.status === "PAID")
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getTransactionById(id: string): Transaction | undefined {
  return transactions.find((transaction) => transaction.id === id);
}

export function getPaidTransactionsWithEmail(): Transaction[] {
  return transactions
    .filter((transaction) => transaction.status === "PAID")
    .filter((transaction) => transaction.customerEmail !== null);
}
