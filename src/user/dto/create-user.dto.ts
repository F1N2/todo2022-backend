import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { Unique } from 'typeorm';
import { User } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @Length(3, 16)
  name: string;

  @IsEmail()
  @Validate(Unique, [User])
  email: string;

  @IsString()
  @Length(8, 32)
  @Validate(Unique, [User])
  password: string;
}
