import type { Merchant } from "./merchant.js";

const merchants: Merchant[] = [
  {
    id: "merchant_001",
    name: "Loja Centro",
    email: "contato@lojacentro.com.br",
    active: true,
  },
];

export function getMerchantName(id: string): string {
  const merchant = merchants.find((item) => item.id === id);

  if (!merchant) {
    return "Lojista Desconhecido";
  }

  return merchant.name;
}
