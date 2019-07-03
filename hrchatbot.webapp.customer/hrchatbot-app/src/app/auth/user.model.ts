export class User {
  constructor(
    public email: string,
    public auth_token: string,
    public auth_token_valid_to: Date
  ) {}

  get token() {
    if (!this.auth_token_valid_to || new Date() > this.auth_token_valid_to) {
      return null;
    }
    return this.auth_token;
  }

}
