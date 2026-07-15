/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  NewProfileInputType,
  UpdatePasswordDto,
  UpdateRoleDto,
  UpdateStatusDto,
} from 'src/dto/user.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
// import { Public } from 'src/decorators/public.decorator';

@Roles(Role.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUser() {
    const users = await this.usersService.getAllUser();
    return {
      meassage: 'Successfully get all Active User',
      data: users,
    };
  }

  @Get(':id')
  async getOneUser(@Param('id') id: string) {
    const user = await this.usersService.getOneUser(id);
    return {
      message: 'Successfully found user',
      data: user,
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

  @Put('me/change-password')
  async updatePassword(@Req() req, @Body() updatePassword: UpdatePasswordDto) {
    const id = req.user.sub as string;
    const data = await this.usersService.updatePassword(id, updatePassword);
    return {
      message: 'Successfully change Password',
      data: data.updatePasswordForUser,
    };
  }
  @Roles(Role.Admin, Role.EMPLOYEE)
  @Put('me/profile')
  async updateUserProfile(
    @Req() req,
    @Body() newProfileInput: NewProfileInputType,
  ) {
    const userId = req.user.sub as string;
    const data = await this.usersService.updateUserProfile(
      userId,
      newProfileInput,
    );
    return {
      message: 'Successfully updated profile',
      data: data.updatedUserProfile,
    };
  }

  // @Post('register')
  // @Public()
  // register(@Body() input: { name: string; email: string; password: string }) {
  //   return this.usersService.register(input);
  // }
}
