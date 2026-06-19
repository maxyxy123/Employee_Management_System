import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Length,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EmployeesDto {
  //User Dto
  @IsString()
  @Length(3, 20)
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 15)
  password: string;

  //EmployeeDto
  @IsString()
  employeeCode: string;
  @IsOptional()
  @IsString()
  phone: string;
  @IsString()
  position: string;
  @IsOptional()
  @IsString()
  departmentId: string;
  @IsDateString()
  joinDate: string;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salary?: number;
  @IsOptional()
  @IsString()
  avatar: string;
  @IsOptional()
  @IsString()
  address: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  phone: string;
  @IsOptional()
  @IsString()
  position: string;

  @IsOptional()
  @IsDateString()
  joinDate: string;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salary?: number;
  @IsOptional()
  @IsString()
  avatar: string;
  @IsOptional()
  @IsString()
  address: string;
}
