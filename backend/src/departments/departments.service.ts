import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepartmentDto, UpdateDepartmentDto } from 'src/dto/departments.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDepartments() {
    const departments = await this.prisma.department.findMany();
    return {
      departments,
    };
  }

  async getOneDepartments(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id: id },
      include: {
        employees: true,
      },
    });
    if (!department) throw new NotFoundException('Department not found');
    return {
      department,
    };
  }

  async createDepartment(departmentInput: DepartmentDto) {
    const department = await this.prisma.department.findUnique({
      where: { name: departmentInput.name },
    });
    if (department) throw new ConflictException('Department has already exist');

    const createdDepartment = await this.prisma.department.create({
      data: {
        name: departmentInput.name,
        description: departmentInput.description,
      },
    });
    return {
      createdDepartment,
    };
  }

  async updateDepartment(
    departmentInput: UpdateDepartmentDto,
    departmentId: string,
  ) {
    const department = await this.prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const name = departmentInput.name?.trim();
    const description = departmentInput.description?.trim();

    if (name && name !== department.name) {
      const existedDepartment = await this.prisma.department.findUnique({
        where: {
          name,
        },
      });

      if (existedDepartment) {
        throw new ConflictException('Department name already exists');
      }
    }

    const updatedDepartment = await this.prisma.department.update({
      where: {
        id: department.id,
      },
      data: {
        name: name || undefined,
        description: description || undefined,
      },
    });

    return {
      updatedDepartment,
    };
  }

  async deleteDepartment(departmentId: string) {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      include: {
        employees: true,
      },
    });
    if (!department) throw new NotFoundException('Department not found');

    if (department.employees.length > 0)
      throw new ConflictException('Department still have employees');

    const deletedDepartment = await this.prisma.department.delete({
      where: { id: department.id },
    });
    return {
      deletedDepartment,
    };
  }
}
