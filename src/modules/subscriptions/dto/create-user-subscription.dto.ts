import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsIn,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserSubscriptionDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({ description: 'Subscription plan ID' })
  @IsUUID(4, { message: 'Plan ID must be a valid UUID' })
  planId: string;

  @ApiPropertyOptional({
    description: 'Subscription status',
    enum: ['active', 'inactive', 'cancelled', 'expired'],
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'cancelled', 'expired'], {
    message: 'Status must be one of: active, inactive, cancelled, expired',
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Billing cycle',
    enum: ['monthly', 'annual'],
  })
  @IsOptional()
  @IsIn(['monthly', 'annual'], {
    message: 'Billing cycle must be either monthly or annual',
  })
  billingCycle?: string;

  @ApiProperty({ description: 'Subscription start date' })
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate: string;

  @ApiPropertyOptional({ description: 'Subscription end date' })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Auto-renew subscription',
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Auto-renew must be a boolean' })
  autoRenew?: boolean;

  @ApiPropertyOptional({ description: 'Stripe subscription ID' })
  @IsOptional()
  @IsString({ message: 'Stripe subscription ID must be a string' })
  stripeSubscriptionId?: string;
}
