import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;
}

export class UpdatePasswordDto {
  @IsString()
  @Length(8, 20)
  password: string;
}
