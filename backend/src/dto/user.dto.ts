import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Prisma } from 'src/generated/prisma/client';

enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    role: true;
    status: true;
    createdAt: true;
  };
}>;
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
  currentPassword: string;
  @IsString()
  @Length(8, 20)
  newPassword: string;
}

export class NewProfileInputType {
  @IsOptional()
  @IsString()
  name: string;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  position: string;
}
