import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getDashboardAdmin(userId: string) {
    const cache_key = `dashboard:AdminId:${userId}`;

    const cacheDashboardData = await this.cacheManager.get(cache_key);

    if (cacheDashboardData !== undefined && cacheDashboardData !== null) {
      console.log('CACHED HIT');
      return cacheDashboardData;
    }

    const [
      admin,
      totalEmployees,
      totalDepartments,
      totalLeaves,
      pendingLeaves,
    ] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          role: true,
        },
      }),
      this.prisma.employee.count(),
      this.prisma.department.count(),
      this.prisma.leave.count(),
      this.prisma.leave.count({
        where: { status: 'PENDING' },
      }),
    ]);

    await this.cacheManager.set(cache_key, {
      admin: {
        name: admin?.name,
        role: admin?.role,
      },

      stats: {
        totalEmployees: totalEmployees,
        totalDepartments: totalDepartments,
        totalLeaves: totalLeaves,
        pendingLeaves: pendingLeaves,
      },
    });

    return {
      admin: {
        name: admin?.name,
        role: admin?.role,
      },

      stats: {
        totalEmployees: totalEmployees,
        totalDepartments: totalDepartments,
        totalLeaves: totalLeaves,
        pendingLeaves: pendingLeaves,
      },
    };
  }

  async getDashboardEmployee(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('user not found');

    if (user.status !== 'ACTIVE')
      throw new UnauthorizedException('User is InActive');

    const employee = await this.prisma.employee.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        department: true,
      },
    });
    if (!employee) throw new NotFoundException('employee not found');

    const cache_key = `dashboard:employeeId:${userId}`;
    const cacheDashboardData = await this.cacheManager.get(cache_key);

    if (cacheDashboardData !== undefined && cacheDashboardData !== null) {
      console.log('CACHED HIT');
      return cacheDashboardData;
    }

    const [totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves] =
      await Promise.all([
        this.prisma.leave.count({
          where: { employeeId: employee.id },
        }),
        this.prisma.leave.count({
          where: { employeeId: employee.id, status: 'PENDING' },
        }),
        this.prisma.leave.count({
          where: { employeeId: employee.id, status: 'APPROVED' },
        }),
        this.prisma.leave.count({
          where: { employeeId: employee.id, status: 'REJECTED' },
        }),
      ]);

    await this.cacheManager.set(cache_key, {
      profile: {
        id: employee.id,
        employeeCode: employee.employeeCode,
        name: employee.user.name,
        email: employee.user.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department?.name || null,
        joinDate: employee.joinDate,
        avatar: employee.avatar,
        status: user.status,
      },
      stats: {
        totalLeaves: totalLeaves,
        pendingLeaves: pendingLeaves,
        approvedLeaves: approvedLeaves,
        rejectedLeaves: rejectedLeaves,
      },
    });

    return {
      profile: {
        id: employee.id,
        employeeCode: employee.employeeCode,
        name: employee.user.name,
        email: employee.user.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department?.name || null,
        joinDate: employee.joinDate,
        avatar: employee.avatar,
        status: user.status,
      },
      stats: {
        totalLeaves: totalLeaves,
        pendingLeaves: pendingLeaves,
        approvedLeaves: approvedLeaves,
        rejectedLeaves: rejectedLeaves,
      },
    };
  }
}
