import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/domain/entity/user.entity';
import { Result } from 'src/types/result.type';
import { RegisterUserDto } from './register.dto';
import {plainToInstance} from "class-transformer"
import { validate } from 'class-validator';
import { CustomError } from '../../../../../errors/custom.error';
import { CreateUserUsecase } from 'src/modules/user/domain/usecases/create-user/create-user.usecase';
import { ERR_INVALID_INPUT } from 'src/errors/invalid-input.error';
import { getPrettyClassValidatorErrors } from 'src/utils/valiation.util';



@Injectable()
export class RegisterUsecase {

  constructor(private createUserUsecase: CreateUserUsecase ) { }

  async run(_dto: RegisterUserDto): Promise<Result<UserEntity, CustomError>>{

    // validate input
    const dto = plainToInstance(RegisterUserDto, _dto)
    const validationErrs = await validate(dto)
    if(validationErrs.length > 0) {
      const prettyErrs = getPrettyClassValidatorErrors(validationErrs)
      return [null, new ERR_INVALID_INPUT(prettyErrs)]
    }

    // dto is valid
    const [user, err] = await this.createUserUsecase.run(dto)
    if(err != null) {
      return [null, err]
    }
    return [user, null]
  }
}
