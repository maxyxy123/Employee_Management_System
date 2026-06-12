import { IsEmail, Length, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 20)
  password: string;
}

export class RegisterDto {
  @IsString()
  @Length(3, 30)
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
