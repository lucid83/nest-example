import { Injectable } from "@nestjs/common";
import { JwtPayload } from "../login/dto/jwt-payload.dto";
import { UserEntity } from "src/modules/user/domain/entity/user.entity";
import { CustomError } from "src/errors/custom.error";
import { Result } from "src/types/result.type";
import { DataSource, Repository } from "typeorm";
import { ERR_USER_NOT_FOUND } from "src/errors/user-not-found.error";

@Injectable()
export class VerifyUsecase {
  private userRepo: Repository<UserEntity>
  constructor(private datasource: DataSource) {
    this.userRepo = this.datasource.getRepository(UserEntity)
  }

  async run(dto: JwtPayload): Promise<Result<UserEntity, CustomError>> {
    const user = await this.userRepo.findOne({ where: [{ email: dto.email }] })
    if (user == null) {
      return [null, new ERR_USER_NOT_FOUND()]
    }
    return [user, null]
  }
}
