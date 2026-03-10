import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuditLogInterceptor } from '../../common/interceptors/audit-log.interceptor';
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Contacts')
@Controller('contacts')
@UseInterceptors(AuditLogInterceptor)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // ========== PUBLIC ROUTE ==========

  /**
   * Submit a contact form — no authentication required.
   * Saves to DB, emails admin, and sends auto-reply to the user.
   */
  @Post()
  @Throttle({ short: { ttl: 60000, limit: 5 } }) // 5 submissions per minute per IP
  @ApiOperation({
    summary: '[Public] Submit contact form',
    description:
      'Anyone can submit a contact message. The admin receives an email notification and the user gets an auto-reply.',
  })
  @ApiBody({ type: CreateContactDto })
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  // ========== ADMIN ROUTES ==========

  /**
   * List all contact submissions (admin only)
   */
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] List all contact submissions' })
  @ApiQuery({ name: 'status', required: false, enum: ['new', 'read', 'replied'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name / email / subject' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.contactsService.findAll({ status, search, skip, take });
  }

  /**
   * Get single contact submission (auto-marks as read)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin:read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Get contact submission details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactsService.findOne(id);
  }

  /**
   * Update status / add admin notes
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('admin:write')
  @ApiBearerAuth('JWT-auth')
  @AuditLog({ action: 'CONTACT_STATUS_UPDATED', resourceType: 'contact' })
  @ApiOperation({ summary: '[Admin] Update contact status and notes' })
  @ApiBody({ type: UpdateContactStatusDto })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateContactStatusDto,
  ) {
    return this.contactsService.updateStatus(id, dto);
  }
}
