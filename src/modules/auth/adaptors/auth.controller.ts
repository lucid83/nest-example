import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserDto } from '../domain/usecases/register/register.dto';
import { RegisterUsecase } from '../domain/usecases/register/register.usecase';
import { LoginDto } from '../domain/usecases/login/dto/authenticate.dto';

@Controller('auth')
export class AuthController {
  constructor(private registerUseCase: RegisterUsecase) { }

  @Post("register")
  async register(@Body() dto: RegisterUserDto) {
    let [_, err] = await this.registerUseCase.run(dto)
    if (err != null) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("login")
  async login(@Body() dto: LoginDto) {

  }

}
