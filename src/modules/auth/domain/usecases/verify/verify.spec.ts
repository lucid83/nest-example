import { Test, TestingModule } from "@nestjs/testing";
import { VerifyUsecase } from "./verify.usecase";
import { UserModule } from "src/modules/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/user/domain/entity/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { RegisterUsecase } from "../register/register.usecase";
import { DataSource } from "typeorm";
import { JwtPayload } from "../login/dto/jwt-payload.dto";
import { LoginUsecase } from "../login/login.usecase";

describe("Verify Usecase", () => {
  let verifyUsecase: VerifyUsecase;
  const userDetails = {
    email: "username@email.com",
    password: "somethingSecure",
    username: "username_unique"
  }

  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          database: "db/g4-test.verify.sqlite",
          type: "sqlite",
          synchronize: true,
          autoLoadEntities: true
        }),
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
          secret: "banger",
        })
      ],
      providers: [RegisterUsecase, LoginUsecase, VerifyUsecase],
    }).compile();

    verifyUsecase = module.get<VerifyUsecase>(VerifyUsecase);
    const datasource = module.get(DataSource)
    await datasource.getRepository(UserEntity).clear()

    await module.get(RegisterUsecase).run(userDetails)
  });

  let payload: JwtPayload
  beforeEach(async () => {
    const [pld, err] = await module.get(LoginUsecase).authenticate(
      {
        email: userDetails.email,
        password: userDetails.password
      }
    )
    expect(err).toBeNull()
    payload = pld
  })

  it('should be defined', () => {
    expect(verifyUsecase).toBeDefined();
  });

  it('should return the user object when given a jwt payload', async () => {
    const [user, verifyErr] = await verifyUsecase.run(payload)
    expect(verifyErr).toBeNull()
    expect(user).toBeInstanceOf(UserEntity)
  })
})
