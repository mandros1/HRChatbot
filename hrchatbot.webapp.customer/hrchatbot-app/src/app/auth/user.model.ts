export class User {
  constructor(
    public email: string,
    public auth_token: string,
    public auth_token_valid_to: Date
    // public email: string,
    // public id: string,
    // private _token: string,
    // private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this.auth_token_valid_to || new Date() > this.auth_token_valid_to) {
      return null;
    }
    return this.auth_token;
  }

  // get token() {
  //   if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
  //     return null;
  //   }
  //   return this._token;
  // }
}
