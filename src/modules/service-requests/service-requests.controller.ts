import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { ServiceRequestQueryDto } from '../../common/dto/query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

import { SubscriptionGuard } from '../../common/guards/subscription.guard';

@ApiTags('Service Requests')
@Controller('service-requests')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class ServiceRequestsController {
  constructor(private readonly service: ServiceRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create service request' })
  @Permissions('service-requests.create')
  @UseGuards(SubscriptionGuard)
  create(@Body() dto: CreateServiceRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service requests' })
  @Permissions('service-requests.read')
  findAll(@Query() query: ServiceRequestQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service request by ID' })
  @Permissions('service-requests.read')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service request' })
  @Permissions('service-requests.update')
  update(@Param('id') id: string, @Body() dto: UpdateServiceRequestDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update service request status' })
  @Permissions('service-requests.update')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestStatusDto,
    @Request() req: any,
  ) {
    return this.service.updateStatus(id, dto, req.user.id);
  }

  @Patch(':id/assign/:operatorId')
  @ApiOperation({ summary: 'Assign operator to service request' })
  @Permissions('service-requests.assign')
  assignOperator(
    @Param('id') id: string,
    @Param('operatorId') operatorId: string,
  ) {
    return this.service.assignOperator(id, operatorId);
  }
}
