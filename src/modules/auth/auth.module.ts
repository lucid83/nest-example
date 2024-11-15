import { Module } from '@nestjs/common';
import { AuthController } from './adaptors/auth.controller';
import { RegisterUsecase } from './domain/usecases/register/register.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entity/user.entity';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './domain/strategy/local.strategy';
import { JwtStrategy } from './domain/strategy/jwt.strategy';
import { LoginUsecase } from './domain/usecases/login/login.usecase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyUsecase } from './domain/usecases/verify/verify.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [RegisterUsecase, LoginUsecase, VerifyUsecase, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
