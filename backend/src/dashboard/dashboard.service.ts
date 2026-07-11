import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getDashboardAdmin(userId: string) {
    /*
     * userId là ID của bảng User lấy từ JWT.
     * Admin không có bảng riêng nên không có adminId.
     */
    const cacheKey = `dashboard:admin:userId:${userId}`;

    /*
     * Kiểm tra user trước để đảm bảo:
     * - User vẫn tồn tại
     * - User vẫn còn quyền ADMIN
     */
    const admin = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        role: true,
        status: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (admin.status !== 'ACTIVE') {
      throw new UnauthorizedException('Admin account is inactive');
    }

    if (admin.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have admin permission');
    }

    const cachedDashboard = await this.cacheManager.get(cacheKey);

    if (cachedDashboard !== undefined && cachedDashboard !== null) {
      console.log('ADMIN DASHBOARD CACHE HIT');
      return cachedDashboard;
    }

    const [totalEmployees, totalDepartments, totalLeaves, pendingLeaves] =
      await Promise.all([
        this.prisma.employee.count(),

        this.prisma.department.count(),

        this.prisma.leave.count(),

        this.prisma.leave.count({
          where: {
            status: 'PENDING',
          },
        }),
      ]);

    const dashboardData = {
      admin: {
        name: admin.name,
        role: admin.role,
        status: admin.status,
      },

      stats: {
        totalEmployees,
        totalDepartments,
        totalLeaves,
        pendingLeaves,
      },
    };

    await this.cacheManager.set(cacheKey, dashboardData);

    return dashboardData;
  }

  async getDashboardEmployee(userId: string) {
    /*
     * Đây vẫn là userId vì giá trị được lấy từ JWT.
     */
    const cacheKey = `dashboard:employee:userId:${userId}`;

    /*
     * Kiểm tra trạng thái tài khoản trước khi đọc cache.
     * Tránh trường hợp tài khoản đã INACTIVE nhưng vẫn dùng cache cũ.
     */
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is inactive');
    }

    if (user.role !== 'EMPLOYEE') {
      throw new ForbiddenException('You do not have employee permission');
    }

    const cachedDashboard = await this.cacheManager.get(cacheKey);

    if (cachedDashboard !== undefined && cachedDashboard !== null) {
      console.log('EMPLOYEE DASHBOARD CACHE HIT');
      return cachedDashboard;
    }

    /*
     * Từ userId tìm ra hồ sơ Employee.
     *
     * User.id       = userId
     * Employee.id   = employeeId
     * Employee.userId liên kết đến User.id
     */
    const employee = await this.prisma.employee.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        employeeCode: true,
        phone: true,
        position: true,
        joinDate: true,
        avatar: true,

        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    /*
     * Leave lưu employeeId, không lưu userId.
     * Vì vậy phải dùng employee.id ở những truy vấn bên dưới.
     */
    const [totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves] =
      await Promise.all([
        this.prisma.leave.count({
          where: {
            employeeId: employee.id,
          },
        }),

        this.prisma.leave.count({
          where: {
            employeeId: employee.id,
            status: 'PENDING',
          },
        }),

        this.prisma.leave.count({
          where: {
            employeeId: employee.id,
            status: 'APPROVED',
          },
        }),

        this.prisma.leave.count({
          where: {
            employeeId: employee.id,
            status: 'REJECTED',
          },
        }),
      ]);

    const dashboardData = {
      profile: {
        id: employee.id,
        employeeCode: employee.employeeCode,

        name: user.name,
        email: user.email,
        status: user.status,

        phone: employee.phone,
        position: employee.position,
        joinDate: employee.joinDate,
        avatar: employee.avatar,

        department: employee.department
          ? {
              id: employee.department.id,
              name: employee.department.name,
            }
          : null,
      },

      stats: {
        totalLeaves,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
      },
    };

    await this.cacheManager.set(cacheKey, dashboardData);

    return dashboardData;
  }
}
