import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/domain/entity/user.entity';
import { Result } from 'src/types/result.type';
import { RegisterUserDto } from './register.dto';
import {plainToInstance} from "class-transformer"
import { validate } from 'class-validator';
import {  ERR_INVALID_INPUT } from '../../errors/invalid-input.error';
import { CustomError } from '../../errors/custom.error';
import { DataSource, Repository } from 'typeorm';



@Injectable()
export class RegisterUsecase {
  private userRepo: Repository<UserEntity>

  constructor(private datasource: DataSource) {
    this.userRepo = datasource.getRepository(UserEntity)
  }

  async run(dto: RegisterUserDto): Promise<Result<UserEntity, CustomError>>{

    // validate input
    const dtoInstance = plainToInstance(RegisterUserDto, dto)
    const validationErrs = await validate(dtoInstance)
    if(validationErrs.length > 0) {
      const inputErrors = {}
      validationErrs.forEach(err => {
        inputErrors[err.property] = Object.values(err.constraints)
        return inputErrors
      })

      return [null, new ERR_INVALID_INPUT(inputErrors)]
    }

    // dto is valid

    return [null, null]
  }
}
