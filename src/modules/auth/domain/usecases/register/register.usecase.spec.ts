import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUsecase } from './register.usecase';
import { RegisterUserDto } from './register.dto';
import { ERR_INVALID_INPUT } from '../../errors/invalid-input.error';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/domain/entity/user.entity';

describe('RegisterUsecase', () => {
  let registerUsecase: RegisterUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ 
        TypeOrmModule.forRoot({
          database: "g4-test.sqlite",
          type: "sqlite",
          synchronize: true,
          autoLoadEntities: true
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [RegisterUsecase,],
    }).compile();

    registerUsecase = module.get<RegisterUsecase>(RegisterUsecase);
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

    console.log(err.cause)
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
