import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from '../domain/usecases/register/register.dto';
import { RegisterUsecase } from '../domain/usecases/register/register.usecase';
import { LocalAuthGuard } from '../domain/guards/local.guard';
import { JwtPayload } from '../domain/usecases/login/dto/jwt-payload.dto';
import { Request } from 'express';
import { LoginUsecase } from '../domain/usecases/login/login.usecase';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../domain/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private registerUseCase: RegisterUsecase, private loginUsecase: LoginUsecase) { }

  @Post("register")
  async register(@Body() dto: RegisterUserDto) {
    let [_, err] = await this.registerUseCase.run(dto)
    if (err != null) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    }
  }

  @Get("login")
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    const [signed, err] = await this.loginUsecase.signPayload(
      req.user as JwtPayload
    )
    if (err != null) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED)
    }
    return signed
  }

  @Get("verify")
  @UseGuards(JwtAuthGuard)
  async verify(@Req() req: Request) {
  }
}
