import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentDto, UpdateDepartmentDto } from 'src/dto/departments.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('departments')
@Roles(Role.Admin)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async getAllDepartments() {
    const data = await this.departmentsService.getAllDepartments();
    return {
      message: 'Successfully get all departments',
      data: data.departments,
    };
  }

  @Get(':id')
  async getOneDepartments(@Param('id') id: string) {
    const data = await this.departmentsService.getOneDepartments(id);
    return {
      message: 'Successfully get one department',
      data: data.department,
    };
  }

  @Post()
  async createDepartment(@Body() departmentInput: DepartmentDto) {
    const data =
      await this.departmentsService.createDepartment(departmentInput);
    return {
      message: 'Successfully create Department',
      data: data.createdDepartment,
    };
  }

  @Put(':id')
  async updateDepartment(
    @Body() departmentInput: UpdateDepartmentDto,
    @Param('id') id: string,
  ) {
    const data = await this.departmentsService.updateDepartment(
      departmentInput,
      id,
    );
    return {
      message: 'Successfully updated Department information',
      data: data.updatedDepartment,
    };
  }

  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    const data = await this.departmentsService.deleteDepartment(id);
    return {
      message: 'Successfully delete this department',
      data: data.deletedDepartment,
    };
  }
}
