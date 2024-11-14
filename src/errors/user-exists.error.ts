import { CustomError } from "./custom.error"

export class ERR_USERNAME_EXISTS extends CustomError {
  static message = "a user with that username already exists"

  constructor( cause?: Record<string, any>) {
    super(ERR_USERNAME_EXISTS.message, cause?? null)
  }
} 

export class ERR_EMAIL_EXISTS extends CustomError {
  static message = "a user with that email already exists"

  constructor( cause?: Record<string, any>) {
    super(ERR_EMAIL_EXISTS.message, cause?? null)
  }
} 
