export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("EMAIL_ALREADY_EXISTS");
    this.name = "EmailAlreadyExistsError";
  }
}
