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

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  getAllDepartments() {
    return this.departmentsService.getAllDepartments();
  }

  @Get(':id')
  getOneDepartments(@Param('id') id: string) {
    return this.departmentsService.getOneDepartments(id);
  }

  @Post()
  createDepartment(@Body() departmentInput: DepartmentDto) {
    return this.departmentsService.createDepartment(departmentInput);
  }

  @Put(':id')
  updateDepartment(
    @Body() departmentInput: UpdateDepartmentDto,
    @Param('id') id: string,
  ) {
    return this.departmentsService.updateDepartment(departmentInput, id);
  }

  @Delete(':id')
  deleteDepartment(@Param('id') id: string) {
    return this.departmentsService.deleteDepartment(id);
  }
}
