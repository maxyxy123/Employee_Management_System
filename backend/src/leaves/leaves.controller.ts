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
    const AllLeaves = await this.leavesService.getAllLeaves();
    return {
      message: 'Successfully get all Leaves',
      data: AllLeaves,
    };
  }

  @Get('me')
  @Roles(Role.EMPLOYEE)
  async getMyLeaves(@Req() req) {
    const userId = req.user.sub as string;
    const leaves = await this.leavesService.getMyLeaves(userId);
    return {
      message: 'Successfully retrieve employee leaves',
      data: leaves,
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
  @Roles(Role.Admin, Role.EMPLOYEE)
  async createLeave(@Body() leaveInput: createLeavesDto, @Req() req) {
    const userId = req.user.sub as string;
    const leave = await this.leavesService.createLeave(leaveInput, userId);
    return {
      message: 'Successfully create Leave request',
      data: leave,
    };
  }

  //PATCH /leaves/:id/status
  @Put(':id/status')
  @Roles(Role.Admin)
  async updateLeaveStatus(
    @Body() statusInput: StatusDto,
    @Param('id') id: string,
  ) {
    const updatedLeaveStatus = await this.leavesService.updateLeaveStatus(
      statusInput,
      id,
    );
    return {
      message: 'Successfully updated status for this leave request',
      data: updatedLeaveStatus,
    };
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteLeave(@Param('id') id: string) {
    const deletedLeave = await this.leavesService.deleteLeave(id);
    return {
      message: 'Successfully delete this leave request',
      data: deletedLeave,
    };
  }
}
