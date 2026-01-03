import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit log entry' })
  create(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditService.create(createAuditLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all audit logs with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.auditService.findAll(page, limit);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get audit logs by user' })
  @ApiQuery({ name: 'userId', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByUser(
    @Query('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.findByUser(userId, page, limit);
  }

  @Get('action')
  @ApiOperation({ summary: 'Get audit logs by action' })
  @ApiQuery({ name: 'action', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByAction(
    @Query('action') action: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.findByAction(action, page, limit);
  }
}
