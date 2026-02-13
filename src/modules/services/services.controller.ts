import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { HttpCacheInterceptor } from '../../common/interceptors/http-cache.interceptor';
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../../common/interceptors/audit-log.interceptor';

@ApiTags('Services')
@Controller('services')
@UseInterceptors(HttpCacheInterceptor, AuditLogInterceptor)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Public/Customer Routes
  @Get()
  @ApiOperation({ summary: '[Public] List active services' })
  @ApiQuery({
    name: 'serviceTypeId',
    required: false,
    description: 'Filter by service type ID',
  })
  findActive(@Query('serviceTypeId') serviceTypeId?: string) {
    return this.servicesService.findActive(serviceTypeId);
  }

  @Get('by-type/:serviceTypeId')
  @ApiOperation({ summary: '[Public] Get services by service type' })
  findByServiceType(@Param('serviceTypeId') serviceTypeId: string) {
    return this.servicesService.findByServiceType(serviceTypeId);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Public] Get service details' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Get(':id/schema')
  @ApiOperation({ summary: '[Public] Get form schema' })
  getSchema(@Param('id') id: string) {
    return this.servicesService.getSchema(id);
  }

  @Get(':id/required-documents')
  @ApiOperation({ summary: '[Public] Get required document list' })
  getRequiredDocuments(@Param('id') id: string) {
    return this.servicesService.getRequiredDocuments(id);
  }

  // Admin Routes
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Create service' })
  @AuditLog({ action: 'SERVICE_CREATED', resourceType: 'service' })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update service' })
  @AuditLog({
    action: 'SERVICE_UPDATED',
    resourceType: 'service',
    captureOldValues: true,
  })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Put(':id/schema')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update form schema' })
  @ApiBody({
    schema: { type: 'object', example: { type: 'object', properties: {} } },
  })
  @AuditLog({ action: 'SERVICE_SCHEMA_UPDATED', resourceType: 'service' })
  updateSchema(
    @Param('id') id: string,
    @Body() schema: Record<string, unknown>,
  ) {
    return this.servicesService.updateSchema(id, schema);
  }

  @Put(':id/document-requirements')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Update document requirements' })
  @AuditLog({
    action: 'SERVICE_DOCUMENT_REQUIREMENTS_UPDATED',
    resourceType: 'service',
  })
  @ApiBody({
    schema: {
      type: 'object',
      example: [
        {
          id: 'doc1',
          name: 'ID Card',
          required: true,
          description: 'Valid identification document',
        },
      ],
    },
  })
  updateDocumentRequirements(
    @Param('id') id: string,
    @Body() documentRequirements: Record<string, unknown>,
  ) {
    return this.servicesService.updateDocumentRequirements(
      id,
      documentRequirements,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Delete service' })
  @AuditLog({ action: 'SERVICE_DELETED', resourceType: 'service' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('services:write')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '[Admin] Activate service' })
  @AuditLog({ action: 'SERVICE_ACTIVATED', resourceType: 'service' })
  activate(@Param('id') id: string) {
    return this.servicesService.activate(id);
  }
}
