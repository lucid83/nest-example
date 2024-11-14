import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forRoot({
    // TODO: use env vars here
    database: "g4.sqlite",
    type: "sqlite",
    synchronize: true,
    autoLoadEntities: true
  })],
  controllers: [],
  providers: [  {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },],
})
export class AppModule {}
