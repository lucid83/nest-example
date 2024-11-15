import { CustomError } from "./custom.error"

export class ERR_INCORRECT_PASSWORD extends CustomError {
  static message = "wrong password given"

  constructor(cause?: Record<string, any>) {
    super(ERR_INCORRECT_PASSWORD.message, cause ?? null)
  }
} 
