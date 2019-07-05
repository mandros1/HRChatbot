export class User {
  constructor(
    public auth_token: string,
    public auth_token_valid_to: number
  ) {}

  get token() {
    if (!this.auth_token_valid_to || this.getCurrentDateInteger() > this.auth_token_valid_to) {
      return null;
    }
    return this.auth_token;
  }


  public getCurrentDateInteger() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const dateDay = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return parseInt(year + month + dateDay + hours + minutes);
  }
}
