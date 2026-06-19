import { IsOptional, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class DepartmentDto {
  @IsString()
  @Length(2, 30)
  name: string;
  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateDepartmentDto extends PartialType(DepartmentDto) {}
