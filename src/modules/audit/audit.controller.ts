import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Audit Logs')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Permissions('audit_logs:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List audit logs' })
  findAll() {
    return this.auditService.findAll();
  }

  @Get('user/:userId')
  @Permissions('audit_logs:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user audit logs' })
  findByUser(@Param('userId') userId: string) {
    return this.auditService.findByUser(userId);
  }

  @Get('resource/:type/:id')
  @Permissions('audit_logs:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get resource audit logs' })
  findByResource(@Param('type') type: string, @Param('id') id: string) {
    return this.auditService.findByResource(type, id);
  }
}