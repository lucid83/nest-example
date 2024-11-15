import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifyUsecase } from '../usecases/verify/verify.usecase';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private verifyUsecase: VerifyUsecase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow("JWT_SECRET")
    });
  }

  async validate(payload: any) {
    // TODO: use jwt-use-case.authenticate to validate
    const [user, verifyErr] = await this.verifyUsecase.run(payload)

    if (verifyErr != null) {
      throw new HttpException(verifyErr, HttpStatus.UNAUTHORIZED)
    }
    return user
  }
}
