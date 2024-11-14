import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUsecase } from './create-user.usecase';
import { ERR_INVALID_INPUT } from 'src/errors/invalid-input.error';
import { CreateUserDto } from './create-user.dto';
import { UserEntity } from '../../entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

describe('CreateUserUsecase', () => {
  let createUsecase: CreateUserUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ 
        TypeOrmModule.forRoot({
          database: "db/g4-test.user.sqlite",
          type: "sqlite",
          synchronize: true,
          autoLoadEntities: true
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [CreateUserUsecase],
    }).compile();

    createUsecase = module.get<CreateUserUsecase>(CreateUserUsecase);
    const datasource = module.get(DataSource)
    datasource.getRepository(UserEntity).clear()
  });

  it('should be defined', () => {
    expect(createUsecase).toBeDefined();
  });


  it("should return a tuple with error of invalid input when given an invalid input", async () => {
    const invalidInput: CreateUserDto = {
      email: undefined,
      password: "somethingSecure",
      username: "username_unique"
    }
    const [user, err] = await createUsecase.run(invalidInput)

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

    const [user, err] = await createUsecase.run(validInput)
    expect(err).toBeNull()
    expect(user).not.toBeNull()
  })

});
