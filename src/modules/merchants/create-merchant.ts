import { randomUUID } from "node:crypto";
import type { Merchant } from "./merchant";

type CreateMerchantInput = {
  name: string;
  email: string;
  phone?: string;
};

export function createMerchant(data: CreateMerchantInput): Merchant {
  return {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    active: true,
  };
}
