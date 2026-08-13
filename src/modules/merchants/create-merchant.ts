import { randomUUID } from "node:crypto";
import type { Merchant } from "./merchant.js";
import type { MerchantStore } from "./merchant-store.js";
import { EmailAlreadyExistsError } from "./merchant-errors.js";

type CreateMerchantInput = {
  name: string;
  email: string;
};

export function createMerchantService(store: MerchantStore) {
  return async function createMerchant(
    data: CreateMerchantInput,
  ): Promise<Merchant> {
    const existingMerchant = await store.findMerchantByEmail(data.email);
    if (existingMerchant) {
      throw new EmailAlreadyExistsError();
    }

    const newMerchant: Merchant = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      active: true,
    };

    return await store.insertMerchant(newMerchant);
  };
}
