import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ERR_INVALID_INPUT } from './errors/invalid-input.error';
import { ValidationError } from 'class-validator';
import { getPrettyClassValidatorErrors } from './utils/valiation.util';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forRoot({
    // TODO: use env vars here
    database: "g4.sqlite",
    type: "sqlite",
    synchronize: true,
    autoLoadEntities: true
  })],
  controllers: [],
  providers: [  
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = getPrettyClassValidatorErrors(validationErrors);

        return new BadRequestException({
          message: ERR_INVALID_INPUT.message,
          errors: errors,
        });
      },
    }),
    },
  ],
})
export class AppModule {}
