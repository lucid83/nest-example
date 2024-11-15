import { CustomError } from "./custom.error"

export class ERR_USER_NOT_FOUND extends CustomError {
  static message = "a user with that email was not found"

  constructor(cause?: Record<string, any>) {
    super(ERR_USER_NOT_FOUND.message, cause ?? null)
  }
} 
