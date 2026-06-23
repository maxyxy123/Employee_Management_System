import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createLeavesDto, StatusDto } from 'src/dto/leaves.dto';
import { Role } from 'src/enum/role.enum';
@Injectable()
export class LeavesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLeaves() {
    const leaves = await this.prisma.leave.findMany();

    return {
      message: 'Successfully get all Leaves',
      data: leaves,
    };
  }

  async getOneLeave(id: string, currentUser: { sub: string; role: Role[] }) {
    const leave = await this.prisma.leave.findUnique({
      where: { id: id },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
              },
            },
          },
        },
      },
    });
    if (!leave) throw new NotFoundException('Leave request not found');

    const isAdmin = currentUser.role.includes(Role.Admin);

    if (isAdmin) {
      return leave;
    }

    //check owner
    const isOwner = currentUser.sub === leave.employee.user.id;

    if (!isOwner) {
      throw new ForbiddenException('This is not your Leave');
    }

    return {
      message: 'Successfully get one Leave',
      data: leave,
    };
  }

  async getMyLeaves(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.status !== 'ACTIVE')
      throw new UnauthorizedException('User is  InACTIVE');

    const employee = await this.prisma.employee.findUnique({
      where: { userId: user.id },
    });

    if (!employee) throw new NotFoundException('Employee Not found');

    const leaves = await this.prisma.leave.findMany({
      where: { employeeId: employee.id },
    });

    return {
      message: 'Successfully retrieve employee leaves',
      data: leaves,
    };
  }
  
  async createLeave(leaveInput: createLeavesDto, userId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId: userId },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const leave = await this.prisma.leave.create({
      data: {
        employeeId: employee.id,
        leaveType: leaveInput.leaveType,
        startDate: leaveInput.startDate,
        endDate: leaveInput.startDate,
        reason: leaveInput.reason,
      },
    });
    return {
      message: 'Successfully create Leave request',
      data: leave,
    };
  }

  async updateLeaveStatus(statusInput: StatusDto, leaveId: string) {
    const leave = await this.prisma.leave.findUnique({
      where: { id: leaveId },
    });

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    const updatedLeaveStatus = await this.prisma.leave.update({
      where: { id: leaveId },
      data: {
        status: statusInput.status,
      },
    });

    return {
      message: 'Successfully updated status for this leave request',
      data: updatedLeaveStatus,
    };
  }

  async deleteLeave(leaveId: string) {
    const leave = await this.prisma.leave.findUnique({
      where: { id: leaveId },
    });

    if (!leave) throw new NotFoundException('Leave request not found');

    const deletedLeave = await this.prisma.leave.delete({
      where: { id: leave.id },
    });
    return {
      message: 'Successfully delete this leave request',
      data: deletedLeave,
    };
  }
}
