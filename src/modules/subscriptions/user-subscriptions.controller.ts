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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('user-subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-subscriptions')
export class UserSubscriptionsController {
  constructor(
    private readonly userSubscriptionsService: UserSubscriptionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user subscription' })
  create(@Body() createUserSubscriptionDto: CreateUserSubscriptionDto) {
    return this.userSubscriptionsService.create(createUserSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user subscriptions' })
  findAll() {
    return { message: 'Admin access not implemented yet' };
  }

  @Get('my-subscription')
  @ApiOperation({ summary: 'Get current user active subscription' })
  getMySubscription(@CurrentUser() user: any) {
    return this.userSubscriptionsService.findActiveByUser(user.id);
  }

  @Get('my-history')
  @ApiOperation({ summary: 'Get current user subscription history' })
  getMyHistory(@CurrentUser() user: any) {
    return this.userSubscriptionsService.findByUser(user.id);
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get expiring subscriptions' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getExpiring() {
    return { message: 'Feature not implemented yet' };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get subscription statistics' })
  getStats() {
    return { message: 'Feature not implemented yet' };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user subscriptions by user ID' })
  findByUser(@Param('userId') userId: string) {
    return this.userSubscriptionsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user subscription by ID' })
  findOne(@Param('id') id: string) {
    return this.userSubscriptionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user subscription' })
  update(
    @Param('id') id: string,
    @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto,
  ) {
    return this.userSubscriptionsService.update(id, updateUserSubscriptionDto);
  }

  @Post(':id/renew')
  @ApiOperation({ summary: 'Renew user subscription' })
  renew() {
    return { message: 'Feature not implemented yet' };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel user subscription' })
  cancel(@Param('id') id: string) {
    return this.userSubscriptionsService.cancel(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user subscription' })
  remove() {
    return { message: 'Feature not implemented yet' };
  }
}
