import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { EmployeesDto, UpdateEmployeeDto } from 'src/dto/employee.dto';
import bcrypt from 'bcrypt';
@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEmployee() {
    const allEmployee = await this.prisma.employee.findMany({
      include: {
        user: true,
        department: true,
      },
    });
    if (allEmployee.length === 0)
      throw new NotFoundException('There is no Employee in any departments');
    return {
      message: 'Successfully retreive all employees',
      data: allEmployee,
    };
  }

  async getOneEmployee(employeeId: string) {
    //findUnique ko tim thay return null

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: true,
        department: true,
        leaves: true,
      },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    return {
      message: 'Successfully retrieved user data',
      data: employee,
    };
  }

  async createEmployee(employeeInput: EmployeesDto) {
    // Hash password trước transaction để transaction chạy nhanh hơn
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(employeeInput.password, salt);

    const employee = await this.prisma.$transaction(async (tx) => {
      // Kiểm tra user tồn tại
      const existUser = await tx.user.findUnique({
        where: {
          email: employeeInput.email,
        },
      });

      if (existUser) {
        throw new ConflictException('Email is already registered');
      }

      // Tạo user
      const createdUser = await tx.user.create({
        data: {
          name: employeeInput.name,
          email: employeeInput.email,
          password: hashPassword,
        },
      });

      // Tạo employee và connect với user vừa tạo
      const createdEmployee = await tx.employee.create({
        data: {
          employeeCode: employeeInput.employeeCode,
          position: employeeInput.position,
          joinDate: new Date(`${employeeInput.joinDate}T00:00:00.000Z`),

          user: {
            connect: {
              id: createdUser.id,
            },
          },
        },
        include: {
          user: true,
        },
      });

      return createdEmployee;
    });
    return {
      message: 'Successfully create User and Employee',
      data: employee,
    };
  }

  async updateEmployee(employeeInput: UpdateEmployeeDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const updateEmployee = await this.prisma.employee.update({
      //undefined thi moi k thay doi trog db
      where: { userId: user.id },
      data: {
        position: employeeInput.position || undefined,
        joinDate: employeeInput.joinDate
          ? new Date(`${employeeInput.joinDate}T00:00:00.000Z`)
          : undefined,
        address: employeeInput.address || undefined,
        avatar: employeeInput.avatar || undefined,
        salary: employeeInput.salary || undefined,
        phone: employeeInput.phone || undefined,
      },
    });

    return {
      message: 'Successfully updated',
      data: updateEmployee,
    };
  }

  async deleteEmployee(userId: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException('User not found');
      const deletedEmployee = await tx.employee.delete({
        where: { userId: user.id },
      });
      const deletedUser = await tx.user.delete({
        where: { id: user.id },
        omit: {
          password: true,
        },
      });
      return {
        deletedEmployee,
        deletedUser,
      };
    });

    return {
      message: 'Successfully delete this employee',
      data: result,
    };
  }
}
