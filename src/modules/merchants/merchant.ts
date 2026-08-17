import { z } from "zod";

export const createMerchantSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Formato de e-mail inválido"),
});

export type Merchant = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
};
