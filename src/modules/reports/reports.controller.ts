import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Reports & Analytics')
@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Permissions('reports:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get dashboard stats' })
  getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get('service-requests')
  @Permissions('reports:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Service request metrics' })
  getServiceRequestMetrics() {
    return this.reportsService.getServiceRequestMetrics();
  }

  @Get('revenue')
  @Permissions('reports:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revenue reports' })
  getRevenueReports() {
    return this.reportsService.getRevenueReports();
  }

  @Get('users')
  @Permissions('reports:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User statistics' })
  getUserStatistics() {
    return this.reportsService.getUserStatistics();
  }

  @Get('appointments')
  @Permissions('reports:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Appointment analytics' })
  getAppointmentAnalytics() {
    return this.reportsService.getAppointmentAnalytics();
  }

  @Get('export')
  @Permissions('reports:export')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export report data' })
  exportReportData() {
    return this.reportsService.exportReportData();
  }
}