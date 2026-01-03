import {
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  IsDateString,
  IsIn,
  IsUUID,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiPropertyOptional({ description: 'Subscription ID' })
  @IsOptional()
  @IsUUID(4, { message: 'Subscription ID must be a valid UUID' })
  subscriptionId?: string;

  @ApiProperty({ description: 'Payment amount' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a valid number with max 2 decimal places' },
  )
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'EUR' })
  @IsOptional()
  @IsString({ message: 'Currency must be a string' })
  @MinLength(3, { message: 'Currency must be exactly 3 characters' })
  @MaxLength(3, { message: 'Currency must be exactly 3 characters' })
  currency?: string;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: [
      'pending',
      'processing',
      'succeeded',
      'failed',
      'cancelled',
      'refunded',
    ],
    default: 'pending',
  })
  @IsOptional()
  @IsIn(
    ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
    {
      message:
        'Status must be one of: pending, processing, succeeded, failed, cancelled, refunded',
    },
  )
  status?: string;

  @ApiPropertyOptional({ description: 'Payment method' })
  @IsOptional()
  @IsString({ message: 'Payment method must be a string' })
  @MaxLength(50, { message: 'Payment method cannot exceed 50 characters' })
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Stripe payment intent ID' })
  @IsOptional()
  @IsString({ message: 'Stripe payment intent ID must be a string' })
  @MaxLength(255, {
    message: 'Stripe payment intent ID cannot exceed 255 characters',
  })
  stripePaymentIntentId?: string;

  @ApiPropertyOptional({ description: 'Stripe charge ID' })
  @IsOptional()
  @IsString({ message: 'Stripe charge ID must be a string' })
  @MaxLength(255, { message: 'Stripe charge ID cannot exceed 255 characters' })
  stripeChargeId?: string;

  @ApiPropertyOptional({ description: 'Payment description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({ description: 'Payment metadata' })
  @IsOptional()
  @IsObject({ message: 'Metadata must be a valid object' })
  metadata?: any;

  @ApiPropertyOptional({ description: 'Payment completion date' })
  @IsOptional()
  @IsDateString({}, { message: 'Paid date must be a valid ISO date string' })
  paidAt?: string;
}
