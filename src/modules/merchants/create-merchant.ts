import { randomUUID } from "node:crypto";

export function createMerchant(data) {
  return {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    active: true,
  };
}
