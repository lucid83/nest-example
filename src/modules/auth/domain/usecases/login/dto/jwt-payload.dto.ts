import { UserEntity } from "src/modules/user/domain/entity/user.entity";

export class JwtPayload {
  username: string
  email: string

  constructor(user: UserEntity) {
    this.username = user.username
    this.email = user.email
  }

  toPojo() {
    return { ...this }
  }
}
