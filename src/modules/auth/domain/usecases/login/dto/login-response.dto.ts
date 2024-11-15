export class LoginResponse {
  constructor(token) {
    this.auth_token = token
  }

  auth_token: string
}
