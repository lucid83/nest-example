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

@Injectable()
export class CreateUserUsecase {
  private userRepo: Repository<UserEntity>
  constructor(private datasource: DataSource) {
    this.userRepo = datasource.getRepository(UserEntity)
  }


  async run(_dto: CreateUserDto): Promise<Result<UserEntity, CustomError>>{
    // validate input
    const dto = plainToInstance(CreateUserDto, _dto)
    const validationErrs = await validate(dto)
    if(validationErrs.length > 0) {
      const inputErrors = {}
      validationErrs.forEach(err => {
        inputErrors[err.property] = Object.values(err.constraints)
        return inputErrors
      })

      return [null, new ERR_INVALID_INPUT(inputErrors)]
    }

    // dto is valid
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
