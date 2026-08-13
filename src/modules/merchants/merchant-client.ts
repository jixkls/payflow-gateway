import type { Merchant } from "./merchant.js";

export async function loadMerchant(id: string): Promise<Merchant> {
  const response = await fetch(`/merchants/${id}`);
  const merchant = await response.json();

  return merchant;
}
