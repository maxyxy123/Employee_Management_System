import { IsOptional, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from 'src/generated/prisma/client';
export class DepartmentDto {
  @IsString()
  @Length(2, 30)
  name: string;
  @IsOptional()
  @IsString()
  description: string;
}

export type AllDepartmentsType = Prisma.DepartmentGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export class UpdateDepartmentDto extends PartialType(DepartmentDto) {}
