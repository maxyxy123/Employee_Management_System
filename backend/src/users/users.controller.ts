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
  async getAllUser() {
    const data = await this.usersService.getAllUser();
    return {
      meassage: 'Successfully get all Active User',
      data: data.allUser,
    };
  }

  @Get(':id')
  async getOneUser(@Param('id') id: string) {
    const data = await this.usersService.getOneUser(id);
    return {
      message: 'Successfully found user',
      data: data.user,
    };
  }

  @Put(':id/role')
  async updateRole(@Param('id') id: string, @Body() updateRole: UpdateRoleDto) {
    const data = await this.usersService.updateRole(id, updateRole);
    return {
      message: 'Successfully update User Role',
      data: data.updatedRoleForUser,
    };
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatus: UpdateStatusDto,
  ) {
    const data = await this.usersService.updateStatus(id, updateStatus);
    return {
      message: 'Successfully update Status',
      data: data.updatedUserStatus,
    };
  }

  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePassword: UpdatePasswordDto,
  ) {
    const data = await this.usersService.updatePassword(id, updatePassword);
    return {
      message: 'Successfully change Password',
      data: data.updatePasswordForUser,
    };
  }
}
