import { z } from "zod";

export type TransactionStatus = "PENDING" | "PAID" | "FAILED";

export const createTransactionSchema = z.object({
  merchantId: z.string().min(1, "O ID do estabelecimento é obrigatório"),
  amount: z
    .number()
    .int()
    .positive("O valor da transação deve ser maior que zero"),
  customerEmail: z.string().email("Formato de e-mail inválido").nullish(),
});

export type Transaction = {
  id: string;
  merchantId: string;
  amount: number;
  status: TransactionStatus;
  customerEmail: string | null;
  created_at?: Date;
  updated_at?: Date;
};
