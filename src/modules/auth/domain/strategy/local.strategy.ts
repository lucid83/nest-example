import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUsecase } from '../usecases/login/login.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private loginUsecase: LoginUsecase) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('validationg from local auth')
    const [jwtPayload, err] = await this.loginUsecase.authenticate({ email, password });
    if (err != null) {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED)
    }
    if (!jwtPayload) {
      throw new UnauthorizedException();
    }
    return jwtPayload;
  }
}
