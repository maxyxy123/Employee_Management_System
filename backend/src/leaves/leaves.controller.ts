import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { createLeavesDto, StatusDto } from 'src/dto/leaves.dto';
import type { Request } from 'express';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get()
  @Roles(Role.Admin)
  async getAllLeaves() {
    const data = await this.leavesService.getAllLeaves();
    return {
      message: 'Successfully get all Leaves',
      data: data.leaves,
    };
  }

  @Get('me')
  @Roles(Role.EMPLOYEE)
  async getMyLeaves(@Req() req) {
    const userId = req.user.sub as string;
    const data = await this.leavesService.getMyLeaves(userId);
    return {
      message: 'Successfully retrieve employee leaves',
      data: data.leaves,
    };
  }

  @Get(':id')
  @Roles(Role.Admin, Role.EMPLOYEE)
  async getOneLeave(@Param('id') id: string, @Req() req) {
    const currentUser = req.user as { sub: string; role: Role[] };
    const data = await this.leavesService.getOneLeave(id, currentUser);
    return {
      meassage: 'Successfully get one Leaves',
      data,
    };
  }

  @Post()
  @Roles(Role.EMPLOYEE)
  async createLeave(@Body() leaveInput: createLeavesDto, @Req() req) {
    const userId = req.user.sub as string;
    const data = await this.leavesService.createLeave(leaveInput, userId);
    return {
      message: 'Successfully create Leave request',
      data: data.leave,
    };
  }

  //PATCH /leaves/:id/status
  @Put(':id/status')
  @Roles(Role.Admin)
  async updateLeaveStatus(
    @Body() statusInput: StatusDto,
    @Param('id') id: string,
  ) {
    const data = await this.leavesService.updateLeaveStatus(statusInput, id);
    return {
      message: 'Successfully updated status for this leave request',
      data: data.updatedLeaveStatus,
    };
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteLeave(@Param('id') id: string) {
    const data = await this.leavesService.deleteLeave(id);
    return {
      message: 'Successfully delete this leave request',
      data: data.deletedLeave,
    };
  }
}
