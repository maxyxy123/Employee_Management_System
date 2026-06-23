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
  getAllLeaves() {
    return this.leavesService.getAllLeaves();
  }

  @Get('me')
  @Roles(Role.EMPLOYEE)
  getMyLeaves(@Req() req) {
    return this.leavesService.getMyLeaves(req.user.sub);
  }
  @Get(':id')
  @Roles(Role.Admin, Role.EMPLOYEE)
  getOneLeave(@Param('id') id: string, @Req() req) {
    return this.leavesService.getOneLeave(id, req.user);
  }

  @Post()
  @Roles(Role.EMPLOYEE)
  createLeave(@Body() leaveInput: createLeavesDto, @Req() req) {
    return this.leavesService.createLeave(leaveInput, req.user.sub);
  }

  //PATCH /leaves/:id/status
  @Put(':id/status')
  @Roles(Role.Admin)
  updateLeaveStatus(@Body() statusInput: StatusDto, @Param('id') id: string) {
    return this.leavesService.updateLeaveStatus(statusInput, id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deleteLeave(@Param('id') id: string) {
    return this.leavesService.deleteLeave(id);
  }
}
