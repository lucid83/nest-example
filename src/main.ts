import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { getPrettyClassValidatorErrors } from './utils/valiation.util';
import { ERR_INVALID_INPUT } from './errors/invalid-input.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 app.useGlobalPipes(
    new ValidationPipe({
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
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
