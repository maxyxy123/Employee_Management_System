import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentsModule } from './departments/departments.module';
import { LeavesModule } from './leaves/leaves.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    EmployeesModule,
    DepartmentsModule,
    LeavesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
