import { Injectable } from '@nestjs/common';
import { UserEntity } from './domain/entity/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {

  private userRepo: Repository<UserEntity>

  constructor(private datasource: DataSource) {
    this.userRepo = datasource.getRepository(UserEntity)
  }

  run(dto: CreateUserDto) {

  }

}
