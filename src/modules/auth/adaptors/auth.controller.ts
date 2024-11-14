import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../domain/usecases/register/register.dto';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post("register")
  async register(@Body() dto: RegisterUserDto) {
    
  }
}
