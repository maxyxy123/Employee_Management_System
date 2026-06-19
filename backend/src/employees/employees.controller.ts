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

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  getAllEmployee() {
    return this.employeesService.getAllEmployee();
  }

  @Get(':id')
  getOneEmployee(@Param('id') id: string) {
    return this.employeesService.getOneEmployee(id);
  }

  //POST /employees
  @Post()
  createEmploye(@Body() employeeInput: EmployeesDto) {
    console.log(employeeInput.password);
    return this.employeesService.createEmployee(employeeInput);
  }

  //PUT /employees/:id
  @Put(':id')
  updateEmployee(
    @Body() employeeInput: UpdateEmployeeDto,
    @Param('id') id: string,
  ) {
    return this.employeesService.updateEmployee(employeeInput, id);
  }

  //DELETE /employees/:id
  @Delete(':id')
  deleteEmployee(@Param('id') id: string) {
    return this.employeesService.deleteEmployee(id);
  }
}
