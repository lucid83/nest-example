import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Auth Controller ', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (GET)', () => {
    const dto = {
      username: "username",
      email: "user@email.com",
      password: "password@124Secure-"
    }

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(201)
  });
});
