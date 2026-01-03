import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionPlansService } from './subscription-plans.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Subscription Plans')
@Controller('subscription-plans')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class SubscriptionPlansController {
  constructor(private readonly service: SubscriptionPlansService) {}

  @Post()
  @ApiOperation({ summary: 'Create subscription plan' })
  @Permissions('subscriptions.create')
  create(@Body() dto: CreateSubscriptionPlanDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscription plans' })
  @Permissions('subscriptions.read')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription plan by ID' })
  @Permissions('subscriptions.read')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update subscription plan' })
  @Permissions('subscriptions.update')
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionPlanDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete subscription plan' })
  @Permissions('subscriptions.delete')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
