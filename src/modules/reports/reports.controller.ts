import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Reports & Analytics')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // General Reports
  @Get('reports/dashboard')
  @Permissions('reports:read')
  @ApiOperation({ summary: '[Admin] Get dashboard stats' })
  getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('reports/service-requests')
  @Permissions('reports:read')
  @ApiOperation({ summary: '[Admin] Service request analytics' })
  getServiceRequestMetrics() {
    return this.reportsService.getServiceRequestMetrics();
  }

  @Get('reports/subscriptions')
  @Permissions('reports:read')
  @ApiOperation({ summary: '[Admin] Subscription metrics' })
  getSubscriptionMetrics() {
    return this.reportsService.getSubscriptionMetrics();
  }

  @Get('reports/revenue')
  @Permissions('reports:read')
  @ApiOperation({ summary: '[Admin] Revenue analytics' })
  getRevenueReports() {
    return this.reportsService.getRevenueReports();
  }

  @Get('reports/users')
  @Permissions('reports:read')
  @ApiOperation({ summary: '[Admin] User statistics' })
  getUserStatistics() {
    return this.reportsService.getUserStatistics();
  }

  @Get('reports/user-activity')
  @Permissions('reports:read')
  @ApiOperation({ summary: '[Admin] User engagement metrics' })
  getUserActivityMetrics() {
    return this.reportsService.getUserActivityMetrics();
  }

  @Get('reports/appointments')
  @Permissions('reports:read')
  @ApiOperation({ summary: '[Admin] Appointment analytics' })
  getAppointmentAnalytics() {
    return this.reportsService.getAppointmentAnalytics();
  }

  @Get('reports/export')
  @Permissions('reports:export')
  @ApiOperation({ summary: '[Admin] Export report data' })
  exportReportData() {
    return this.reportsService.exportReportData();
  }
}
