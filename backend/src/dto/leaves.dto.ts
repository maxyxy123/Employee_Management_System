import { IsDateString, IsEnum, IsString, Length } from 'class-validator';

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
