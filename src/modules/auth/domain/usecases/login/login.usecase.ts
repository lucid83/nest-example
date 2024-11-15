import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/modules/user/domain/entity/user.entity";
import { DataSource, Repository } from "typeorm";
import { LoginDto } from "./dto/authenticate.dto";
import { Result } from "src/types/result.type";
import { CustomError } from "src/errors/custom.error";
import { ERR_USER_NOT_FOUND } from "src/errors/user-not-found.error";
import { JwtPayload } from "./dto/jwt-payload.dto";
import { compare } from "bcrypt";
import { ERR_INCORRECT_PASSWORD } from "src/errors/incorrect-password.error";
import { validateInput } from "src/utils/valiation.util";
import { SignedPayload } from "./dto/login-response.dto";
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class LoginUsecase {
  private userRepo: Repository<UserEntity>
  constructor(private datasource: DataSource, private jwtService: JwtService) {
    this.userRepo = this.datasource.getRepository(UserEntity)
  }

  async authenticate(_dto: LoginDto): Promise<Result<JwtPayload, CustomError>> {
    const [dto, err] = await validateInput(LoginDto, _dto)
    if (err != null) {
      return [null, err]
    }

    const user = await this.userRepo.findOne({ where: [{ email: dto.email }] })
    if (user == null) {
      return [null, new ERR_USER_NOT_FOUND()]
    }

    const isValidPassword = await compare(dto.password, user.passwordHash)
    if (!isValidPassword) {
      return [null, new ERR_INCORRECT_PASSWORD()]
    }
    return [new JwtPayload(user), null]
  }

  async signPayload(payload: JwtPayload): Promise<Result<SignedPayload, CustomError>> {
    // TODO: validate input

    const token = this.jwtService.sign(payload.toPojo())
    const signedPayload = new SignedPayload(token)
    return [signedPayload, null]
  }
}
