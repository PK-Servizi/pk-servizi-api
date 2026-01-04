import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionPlanDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  interval: string; // 'month' | 'year'

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  stripePriceId?: string;
}

export class UpdateSubscriptionPlanDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class CreateCheckoutDto {
  @ApiProperty()
  @IsString()
  planId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  successUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cancelUrl?: string;
}

export class UpgradeSubscriptionDto {
  @ApiProperty()
  @IsString()
  newPlanId: string;
}

export class UpdateSubscriptionStatusDto {
  @ApiProperty({ enum: ['active', 'cancelled', 'past_due', 'unpaid'] })
  @IsString()
  status: string;
}

export class ProcessRefundDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}