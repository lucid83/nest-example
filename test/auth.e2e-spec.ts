import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { ERR_INVALID_INPUT } from 'src/errors/invalid-input.error';
import { ERR_EMAIL_EXISTS, ERR_USERNAME_EXISTS } from 'src/errors/user-exists.error';
import { RegisterUsecase } from 'src/modules/auth/domain/usecases/register/register.usecase';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entity/user.entity';

describe('Auth Controller ', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const datasource = app.get(DataSource)
    datasource.getRepository(UserEntity).clear()
  });

  describe("/auth/register (POST)", () => {

    it('should return 201 given a valid input', () => {
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


    it("should return 400 give a bad input", () => {
      const badInput = {
        username: undefined,
        email: "user@email.com",
        password: "password@124Secure-"
      }

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(badInput)
        .expect(400)
        .expect((res: Response) => {
          expect(res.body).toHaveProperty("message")
          expect(res.body).toHaveProperty("errors")
        })
    })
  })

    it('should return 400 when trying to create a user of existing email', async () => {
      const dto = {
        username: "username",
        email: "user@email.com",
        password: "password@124Secure-"
      }

    await request(app.getHttpServer())
        .post('/auth/register')
        .send(dto)
        .expect(201)
        .expect({})

    dto.email = "user1@email.com"

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(dto)
        .expect(400)
        .expect(new RegExp(`{"message":"${ERR_USERNAME_EXISTS.message}","cause":null}`))

    dto.email = "user@email.com"
    dto.username = "user2"
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(dto)
        .expect(400)
        .expect(new RegExp(`{"message":"${ERR_EMAIL_EXISTS.message}","cause":null}`))
    });

});
