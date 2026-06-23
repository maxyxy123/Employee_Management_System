import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles(Role.Admin)
  async getDashboardAdmin(@Req() req) {
    const data = await this.dashboardService.getDashboardAdmin(req.user.sub);
    return {
      message: 'Successfully get Dashboard Admin',
      data: data.admin,
      stats: data.stats,
    };
  }

  @Get('employee')
  @Roles(Role.EMPLOYEE)
  async getDashboardEmployee(@Req() req) {
    const data = await this.dashboardService.getDashboardEmployee(req.user.sub);
    return {
      message: 'Successfully get employee dashboard',
      data: data.profile,
      stats: data.stats,
    };
  }
}
