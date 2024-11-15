import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LoginUsecase } from './login.usecase';
import { UserEntity } from 'src/modules/user/domain/entity/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { RegisterUsecase } from '../register/register.usecase';
import { JwtPayload } from './dto/jwt-payload.dto';

describe('LoginUsecase', () => {
  let loginUsecase: LoginUsecase;
  const userDetails = {
    email: "username@email.com",
    password: "somethingSecure",
    username: "username_unique"
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          database: "db/g4-test.authenticate.sqlite",
          type: "sqlite",
          synchronize: true,
          autoLoadEntities: true
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [RegisterUsecase, LoginUsecase],
    }).compile();

    loginUsecase = module.get<LoginUsecase>(LoginUsecase);
    const datasource = module.get(DataSource)
    await datasource.getRepository(UserEntity).clear()

    await module.get(RegisterUsecase).run(userDetails)
  });

  it('should be defined', () => {
    expect(loginUsecase).toBeDefined();
  });

  describe("login.authenticate", () => {

    it("should return a valid payload when given a valid dto", async () => {
      const dto = {
        email: userDetails.email,
        password: userDetails.password
      }

      const [payload, err] = await loginUsecase.authenticate(dto)
      expect(err).toBeNull()
      expect(payload).toBeInstanceOf(JwtPayload)
    })

    it("should return an error when given an invalid dto", async () => {
      const dto = {
        email: undefined,
        password: userDetails.password
      }

      const [payload, err] = await loginUsecase.authenticate(dto)
      expect(err).not.toBeNull()
    })

  })

})
