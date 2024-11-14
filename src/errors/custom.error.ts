export class CustomError extends Error {

  cause: Record<string, any>

  constructor(message: string, cause?:Record<string, any>  ){
    super()
    this.message = message
    this.cause = cause 
  }
}

