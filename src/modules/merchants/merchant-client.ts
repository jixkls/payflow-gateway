import type { Merchant } from "./merchant.js";

export async function loadMerchant(id: string): Promise<Merchant> {
  const response = await fetch(`/merchants/${id}`);
  const merchant = await response.json();
  return merchant;
}

export async function saveMerchant(data: {
  name: string;
  email: string;
}): Promise<Merchant> {
  const response = await fetch("/merchants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const merchant = await response.json();
  return merchant;
}
