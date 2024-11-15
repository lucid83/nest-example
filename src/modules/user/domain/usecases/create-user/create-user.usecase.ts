import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { Result } from 'src/types/result.type';
import { UserEntity } from '../../entity/user.entity';
import { CustomError } from 'src/errors/custom.error';
import { ERR_INVALID_INPUT } from 'src/errors/invalid-input.error';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { getPrettyClassValidatorErrors, validateInput } from 'src/utils/valiation.util';
import { ERR_EMAIL_EXISTS, ERR_USERNAME_EXISTS } from 'src/errors/user-exists.error';

@Injectable()
export class CreateUserUsecase {
  private userRepo: Repository<UserEntity>
  constructor(private datasource: DataSource) {
    this.userRepo = this.datasource.getRepository(UserEntity)
  }


  async run(_dto: CreateUserDto): Promise<Result<UserEntity, CustomError>> {
    const [dto, inputErr] = await validateInput(CreateUserDto, _dto)
    if (inputErr != null) {
      return [null, inputErr]
    }

    // dto is valid
    // check if user already exists
    const existingUser = await this.userRepo.findOne({ where: [{ email: dto.email }, { username: dto.username }] })
    if (existingUser != null) {
      if (existingUser.email == dto.email) {
        return [null, new ERR_EMAIL_EXISTS]
      }
      if (existingUser.username == dto.username) {
        return [null, new ERR_USERNAME_EXISTS]
      }
    }

    const user = this.userRepo.create(
      {
        email: dto.email,
        username: dto.username,
        passwordHash: await hash(dto.password, 12)
      }
    )
    await this.userRepo.save(user)
    return [user, null]
  }
}
