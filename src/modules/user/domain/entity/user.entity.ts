import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "users"})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true, nullable: false})
  email: string

  @Column({unique: true, nullable: false})
  username: string

  @Column({unique: true, nullable: false})
  passwordHash: string
}
