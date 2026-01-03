import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsObject,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionPlanDto {
  @ApiProperty({ description: 'Plan name', example: 'Premium' })
  @IsString({ message: 'Plan name must be a string' })
  @MinLength(2, { message: 'Plan name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Plan name cannot exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({ description: 'Plan description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({ description: 'Monthly price in EUR', example: 19.99 })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Monthly price must be a valid number with max 2 decimal places',
    },
  )
  @Min(0, { message: 'Monthly price cannot be negative' })
  priceMonthly?: number;

  @ApiPropertyOptional({ description: 'Annual price in EUR', example: 199.99 })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Annual price must be a valid number with max 2 decimal places',
    },
  )
  @Min(0, { message: 'Annual price cannot be negative' })
  priceAnnual?: number;

  @ApiPropertyOptional({
    description: 'Plan features',
    example: ['isee', '730_complete', 'imu'],
  })
  @IsOptional()
  @IsObject({ message: 'Features must be a valid object' })
  features?: any;

  @ApiPropertyOptional({
    description: 'Service limits',
    example: { max_requests_per_month: 10 },
  })
  @IsOptional()
  @IsObject({ message: 'Service limits must be a valid object' })
  serviceLimits?: any;

  @ApiPropertyOptional({ description: 'Is plan active', default: true })
  @IsOptional()
  @IsBoolean({ message: 'Active status must be a boolean' })
  isActive?: boolean;
}
