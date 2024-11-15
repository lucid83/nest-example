import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUsecase } from './register.usecase';
import { RegisterUserDto } from './register.dto';
import { ERR_INVALID_INPUT } from 'src/errors/invalid-input.error';
import { UserModule } from 'src/modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/domain/entity/user.entity';
import { DataSource } from 'typeorm';
describe('RegisterUsecase', () => {
  let registerUsecase: RegisterUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule,
        TypeOrmModule.forRoot({
          database: "db/g4-test.auth.sqlite",
          type: "sqlite",
          synchronize: true,
          autoLoadEntities: true
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [RegisterUsecase],
    }).compile();

    registerUsecase = module.get<RegisterUsecase>(RegisterUsecase);
    const datasource = module.get(DataSource);
    await datasource.getRepository(UserEntity).clear()
  });

  it('should be defined', () => {
    expect(registerUsecase).toBeDefined();
  });

  it("should return a tuple with error of invalid input when given an invalid input", async () => {
    const invalidInput: RegisterUserDto = {
      email: undefined,
      password: "somethingSecure",
      username: "username_unique"
    }
    const [user, err] = await registerUsecase.run(invalidInput)

    expect(err.message).toEqual(ERR_INVALID_INPUT.message)
    expect(user).toBeNull()
  })

  it("should return a result of a valid user and a null error given valid input", async () => {
    const validInput = {
      email: "username@email.com",
      password: "somethingSecure",
      username: "username_unique"
    }

    const [user, err] = await registerUsecase.run(validInput)
    expect(err).toBeNull()
    expect(user).not.toBeNull()
  })

});
