import { CustomError } from "./custom.error"

export class ERR_INVALID_INPUT extends CustomError {
  static message = "Invalid input"

  constructor( cause?: Record<string, any>) {
    super(ERR_INVALID_INPUT.message, cause?? null)
  }
} 
