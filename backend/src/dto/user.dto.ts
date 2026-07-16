/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, '') : value,
  )
  @IsOptional()
  @IsString()
  name: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const trimValue = value.trim().replace(/\s+/g, ' ');
    return trimValue === '' ? undefined : trimValue;
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    const trimValue = value.trim().replace(/\s+/g, ' ');
    return trimValue === '' ? undefined : trimValue;
  })
  @IsString()
  @IsOptional()
  position: string;
}
