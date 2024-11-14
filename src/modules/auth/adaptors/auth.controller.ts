import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserDto } from '../domain/usecases/register/register.dto';
import { RegisterUsecase } from '../domain/usecases/register/register.usecase';

@Controller('auth')
export class AuthController {
  constructor(private registerUseCase: RegisterUsecase) {}

  @Post("register")
  async register(@Body() dto: RegisterUserDto) {
    let [user, err] = await this.registerUseCase.run(dto)
    if(err != null) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    }
  }
}
