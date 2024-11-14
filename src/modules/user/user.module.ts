import { Module } from '@nestjs/common';
import { CreateUserUsecase } from './domain/usecases/create-user/create-user.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [ CreateUserUsecase],
  exports: [CreateUserUsecase]
})
export class UserModule {}
