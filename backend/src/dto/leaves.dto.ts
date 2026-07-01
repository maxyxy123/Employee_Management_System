import { IsDateString, IsEnum, IsString, Length } from 'class-validator';
import { Prisma } from 'src/generated/prisma/client';

enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

enum LeaveType {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  UNPAID = 'UNPAID',
  OTHER = 'OTHER',
}

export class createLeavesDto {
  @IsEnum(LeaveType)
  leaveType: LeaveType;
  @IsDateString()
  startDate: string;
  @IsDateString()
  endDate: string;
  @IsString()
  @Length(1, 100)
  reason: string;
}

export class StatusDto {
  @IsEnum(LeaveStatus)
  status: LeaveStatus;
}

export type AllLeavesTypeforCache = Prisma.DepartmentGetPayload<{
  include: {
    employees: true;
  };
}>;

export type LeaveWithEmployeeUser = Prisma.LeaveGetPayload<{
  include: {
    employee: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            role: true;
            status: true;
          };
        };
      };
    };
  };
}>;
