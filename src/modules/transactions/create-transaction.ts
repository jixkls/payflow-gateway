import { randomUUID } from "node:crypto";
import type { Transaction } from "./transaction.js";
import type { TransactionStore } from "./transaction-store.js";

type CreateTransactionInput = {
  merchantId: string;
  amount: number;
  customerEmail?: string | null;
};

// O Serviço recebe o repositório como dependência
export function createTransactionService(transactionStore: TransactionStore) {
  return async function createTransaction(
    data: CreateTransactionInput,
  ): Promise<Transaction> {
    // Regra de Domínio centralizada: Protege o sistema caso alguma entrada
    // pule a validação do Zod nas rotas (como o supervisor provocou!)
    if (data.amount <= 0) {
      throw new Error(
        "O valor da transação deve ser estritamente maior que zero.",
      );
    }

    // O Backend define o status PENDING ignorando o cliente
    const newTransaction: Transaction = {
      id: randomUUID(),
      merchantId: data.merchantId,
      amount: data.amount,
      status: "PENDING",
      customerEmail: data.customerEmail || null,
    };

    // Manda salvar. O banco de dados garante se o lojista existe.
    return await transactionStore.insertTransaction(newTransaction);
  };
}
