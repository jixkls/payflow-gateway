export type TransactionStatus = "PENDING" | "PAID" | "FAILED";

export type Transaction = {
  id: string;
  merchantId: string;
  amount: number;
  status: TransactionStatus;
  customerEmail: string | null;
};
