import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.Admin)
  getDashboardAdmin(@Req() req) {
    return this.dashboardService.getDashboardAdmin(req.user.sub);
  }

  @Get('employee')
  @Roles(Role.EMPLOYEE)
  getDashboardEmployee(@Req() req) {
    return this.dashboardService.getDashboardEmployee(req.user.sub);
  }
}
