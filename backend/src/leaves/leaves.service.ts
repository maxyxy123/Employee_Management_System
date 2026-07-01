import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AllLeavesTypeforCache,
  createLeavesDto,
  LeaveWithEmployeeUser,
  StatusDto,
} from 'src/dto/leaves.dto';
import { Role } from 'src/enum/role.enum';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class LeavesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAllLeaves() {
    const cache_Key = 'leaves:all';
    const cacheLeaves =
      await this.cacheManager.get<AllLeavesTypeforCache[]>(cache_Key);

    if (cacheLeaves !== undefined && cacheLeaves !== null) {
      console.log('Cached HIt');
      return cacheLeaves;
    }

    const leaves = await this.prisma.leave.findMany();

    await this.cacheManager.set(cache_Key, leaves);
    return leaves;
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

    const cache_Key = `leaves:user:${userId}`;
    const cacheLeaves = await this.cacheManager.get(cache_Key);

    if (cacheLeaves !== undefined && cacheLeaves !== null) {
      return cacheLeaves;
    }

    const leaves = await this.prisma.leave.findMany({
      where: { employeeId: employee.id },
    });

    await this.cacheManager.set(cache_Key, leaves);

    return leaves;
  }

  async getOneLeave(id: string, currentUser: { sub: string; role: Role[] }) {
    const cacheKey = `leave:id:${id}`;

    let leave = await this.cacheManager.get<LeaveWithEmployeeUser | null>(
      cacheKey,
    );

    if (!leave) {
      leave = await this.prisma.leave.findUnique({
        where: { id },
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

      await this.cacheManager.set(cacheKey, leave);
    }

    const isAdmin = currentUser.role.includes(Role.Admin);
    const isOwner = currentUser.sub === leave.employee.user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('This is not your Leave');
    }

    return {
      leave,
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
        endDate: leaveInput.endDate,
        reason: leaveInput.reason,
      },
    });
    await this.cacheManager.del('leaves:all');
    await this.cacheManager.del(`leaves:user:${userId}`);
    return leave;
  }

  async updateLeaveStatus(statusInput: StatusDto, leaveId: string) {
    const leave = await this.prisma.leave.findUnique({
      where: { id: leaveId },
      include: {
        employee: {
          select: { userId: true },
        },
      },
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

    await this.cacheManager.del('leaves:all');
    await this.cacheManager.del(`leave:id:${leaveId}`);
    await this.cacheManager.del(`leaves:user:${leave.employee.userId}`);
    return updatedLeaveStatus;
  }

  async deleteLeave(leaveId: string) {
    const leave = await this.prisma.leave.findUnique({
      where: { id: leaveId },
      include: {
        employee: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!leave) throw new NotFoundException('Leave request not found');

    const deletedLeave = await this.prisma.leave.delete({
      where: { id: leave.id },
    });
    await this.cacheManager.del('leaves:all');
    await this.cacheManager.del(`leave:id:${leaveId}`);
    await this.cacheManager.del(`leaves:user:${leave.employee.userId}`);
    return deletedLeave;
  }
}
