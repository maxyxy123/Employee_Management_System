import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AllDepartmentsType,
  DepartmentDto,
  UpdateDepartmentDto,
} from 'src/dto/departments.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAllDepartments() {
    const cache_key = 'department:all';
    const cacheDepartments =
      await this.cacheManager.get<AllDepartmentsType[]>(cache_key);

    if (cacheDepartments !== undefined && cacheDepartments !== null) {
      console.log('CACHED HIT');

      return cacheDepartments;
    }

    const departments = await this.prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    await this.cacheManager.set(cache_key, departments);

    return departments;
  }

  async getOneDepartments(id: string) {
    const cache_key = `department:id:${id}`;

    const cachedDepartment = await this.cacheManager.get(cache_key);

    if (cachedDepartment !== undefined && cachedDepartment !== null) {
      console.log('CACHED HIT');
      return cachedDepartment;
    }

    const department = await this.prisma.department.findUnique({
      where: { id: id },
      include: {
        employees: true,
      },
    });
    if (!department) throw new NotFoundException('Department not found');

    await this.cacheManager.set(cache_key, department);

    return department;
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

    await this.cacheManager.del('department:all');
    return createdDepartment;
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

    await this.cacheManager.del('department:all');
    await this.cacheManager.del(`department:id:${departmentId}`);

    return updatedDepartment;
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

    await this.cacheManager.del('department:all');
    await this.cacheManager.del(`department:id:${departmentId}`);
    return deletedDepartment;
  }
}
