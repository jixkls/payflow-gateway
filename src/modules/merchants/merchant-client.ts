import type { Merchant } from "./merchant.js";

export async function loadMerchant(id: string): Promise<Merchant> {
  const response = fetch(`/merchants/${id}`);
  const merchant = response.json();

  return merchant;
}
