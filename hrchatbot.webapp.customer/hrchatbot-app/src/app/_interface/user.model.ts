export interface User {
  auth_token: string;
  auth_token_valid_to: Date;
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  salt: string;
}
