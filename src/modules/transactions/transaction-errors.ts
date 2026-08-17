export class MerchantNotFoundError extends Error {
  constructor() {
    super("MERCHANT_NOT_FOUND");
    this.name = "MerchantNotFoundError";
  }
}
