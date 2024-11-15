import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/modules/user/domain/entity/user.entity";
import { DataSource, Repository } from "typeorm";
import { LoginDto } from "./dto/authenticate.dto";
import { Result } from "src/types/result.type";
import { CustomError } from "src/errors/custom.error";
import { LoginResponse } from "./dto/login-response.dto";
import { ERR_USER_NOT_FOUND } from "src/errors/user-not-found.error";
import { JwtPayload } from "./dto/jwt-payload.dto";
import { compare } from "bcrypt";
import { ERR_INCORRECT_PASSWORD } from "src/errors/incorrect-password.error";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { getPrettyClassValidatorErrors } from "src/utils/valiation.util";
import { ERR_INVALID_INPUT } from "src/errors/invalid-input.error";

@Injectable()
export class LoginUsecase {
  private userRepo: Repository<UserEntity>
  constructor(private datasource: DataSource) {
    this.userRepo = this.datasource.getRepository(UserEntity)
  }

  async authenticate(_dto: LoginDto): Promise<Result<JwtPayload, CustomError>> {
    // TODO: validate dto
    //
    const dto = plainToInstance(LoginDto, _dto)
    const validationErrs = await validate(dto)
    if (validationErrs.length > 0) {
      const prettyErrs = getPrettyClassValidatorErrors(validationErrs)
      return [null, new ERR_INVALID_INPUT(prettyErrs)]
    }

    console.log(dto)
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
}
