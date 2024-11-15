import { Module } from '@nestjs/common';
import { AuthController } from './adaptors/auth.controller';
import { RegisterUsecase } from './domain/usecases/register/register.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/entity/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ TypeOrmModule.forFeature([UserEntity]), UserModule ],
  controllers: [AuthController],
  providers: [RegisterUsecase],
})
export class AuthModule {}
