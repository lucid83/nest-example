import {IsEmail, Length } from "class-validator";

export class RegisterUserDto {
  @Length(4, 18)
  readonly username: string

  @Length(8, 32)
  readonly password: string;

  @IsEmail()
  readonly email: string;
}
