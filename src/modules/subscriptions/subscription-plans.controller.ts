import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionPlansService } from './subscription-plans.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { HttpCacheInterceptor } from '../../common/interceptors/http-cache.interceptor';
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../../common/interceptors/audit-log.interceptor';

/**
 * Subscription Plans Controller - Admin CRUD Operations
 * Manages subscription plan templates (Basic, Professional, Premium, etc.)
 * Separated from user subscription management for better organization
 */
@ApiTags('Admin - Subscription Plans')
@Controller('admin/subscription-plans')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
@UseInterceptors(HttpCacheInterceptor, AuditLogInterceptor)
export class SubscriptionPlansController {
  constructor(private readonly plansService: SubscriptionPlansService) {}

  /**
   * Get all subscription plans (admin view with inactive plans)
   */
  @Get()
  @Permissions('subscription_plans:read')
  @ApiOperation({ summary: '[Admin] List all subscription plans' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  async findAll(@Query('includeInactive') includeInactive?: string) {
    if (includeInactive === 'true') {
      return this.plansService.findAll();
    }
    return this.plansService.findActive();
  }

  /**
   * Get a single subscription plan by ID
   */
  @Get(':id')
  @Permissions('subscription_plans:read')
  @ApiOperation({ summary: '[Admin] Get subscription plan details' })
  async findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  /**
   * Create a new subscription plan
   */
  @Post()
  @Permissions('subscription_plans:write')
  @ApiOperation({ summary: '[Admin] Create new subscription plan' })
  @ApiBody({ type: CreateSubscriptionPlanDto })
  @AuditLog({ action: 'SUBSCRIPTION_PLAN_CREATED', resourceType: 'subscription_plan' })
  async create(@Body() dto: CreateSubscriptionPlanDto) {
    return this.plansService.create(dto);
  }

  /**
   * Update an existing subscription plan
   */
  @Put(':id')
  @Permissions('subscription_plans:write')
  @ApiOperation({ summary: '[Admin] Update subscription plan' })
  @ApiBody({ type: UpdateSubscriptionPlanDto })
  @AuditLog({ action: 'SUBSCRIPTION_PLAN_UPDATED', resourceType: 'subscription_plan', captureOldValues: true })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionPlanDto,
  ) {
    return this.plansService.update(id, dto);
  }

  /**
   * Soft delete / deactivate a subscription plan
   * Prevents new subscriptions but keeps existing ones intact
   */
  @Delete(':id')
  @Permissions('subscription_plans:delete')
  @ApiOperation({ summary: '[Admin] Deactivate subscription plan' })
  @AuditLog({ action: 'SUBSCRIPTION_PLAN_DEACTIVATED', resourceType: 'subscription_plan' })
  async deactivate(@Param('id') id: string) {
    return this.plansService.deactivate(id);
  }

  /**
   * Get plan comparison data for public display
   */
  @Get('public/comparison')
  @Permissions('subscription_plans:read')
  @ApiOperation({ summary: '[Admin] Get plan comparison matrix' })
  async getComparison() {
    return this.plansService.getComparison();
  }

  /**
   * Get subscription statistics per plan
   */
  @Get(':id/statistics')
  @Permissions('subscription_plans:read')
  @ApiOperation({ summary: '[Admin] Get plan subscription statistics' })
  async getStatistics(@Param('id') id: string) {
    return this.plansService.getStatistics(id);
  }

  /**
   * Clone an existing plan as a template
   */
  @Post(':id/clone')
  @Permissions('subscription_plans:write')
  @ApiOperation({ summary: '[Admin] Clone subscription plan' })
  @ApiBody({
    schema: { type: 'object', properties: { name: { type: 'string' } } },
  })
  @AuditLog({ action: 'SUBSCRIPTION_PLAN_CLONED', resourceType: 'subscription_plan' })
  async clone(@Param('id') id: string, @Body('name') name: string) {
    return this.plansService.clone(id, name);
  }
}
