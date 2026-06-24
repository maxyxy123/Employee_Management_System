import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesDto, UpdateEmployeeDto } from 'src/dto/employee.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('employees')
@Roles(Role.Admin)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async getAllEmployee() {
    const data = await this.employeesService.getAllEmployee();
    return {
      message: 'Successfully retreive all employees',
      data: data.allEmployee,
    };
  }

  @Get(':id')
  async getOneEmployee(@Param('id') id: string) {
    const data = await this.employeesService.getOneEmployee(id);
    return {
      message: 'Successfully retrieved user data',
      data: data.employee,
    };
  }

  //POST /employees
  @Post()
  async createEmploye(@Body() employeeInput: EmployeesDto) {
    console.log(employeeInput.password);
    const data = await this.employeesService.createEmployee(employeeInput);
    return {
      message: 'Successfully create User and Employee',
      data: data.employee,
    };
  }

  //PUT /employeconst data = await
  @Put(':id')
  async updateEmployee(
    @Body() employeeInput: UpdateEmployeeDto,
    @Param('id') id: string,
  ) {
    const data = await this.employeesService.updateEmployee(employeeInput, id);
    return {
      message: 'Successfully updated',
      data: data.updateEmployee,
    };
  }

  //DELETE /employees/:id
  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    const data = await this.employeesService.deleteEmployee(id);
    return {
      message: 'Successfully delete this employee',
      data: data.result,
    };
  }
}
