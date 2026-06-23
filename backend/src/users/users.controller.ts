import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UpdatePasswordDto,
  UpdateRoleDto,
  UpdateStatusDto,
} from 'src/dto/user.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';

@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.usersService.getOneUser(id);
  }

  @Put(':id/role')
  updateRole(@Param('id') id: string, @Body() updateRole: UpdateRoleDto) {
    return this.usersService.updateRole(id, updateRole);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateStatus: UpdateStatusDto) {
    return this.usersService.updateStatus(id, updateStatus);
  }

  @Put(':id/password')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePassword: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePassword);
  }
}
