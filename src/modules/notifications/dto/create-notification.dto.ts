import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsDateString,
  IsIn,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({ description: 'Notification title' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString({ message: 'Message must be a string' })
  @MinLength(1, { message: 'Message cannot be empty' })
  @MaxLength(1000, { message: 'Message cannot exceed 1000 characters' })
  message: string;

  @ApiPropertyOptional({
    description: 'Notification type',
    enum: ['info', 'success', 'warning', 'error', 'reminder'],
    default: 'info',
  })
  @IsOptional()
  @IsIn(['info', 'success', 'warning', 'error', 'reminder'], {
    message: 'Type must be one of: info, success, warning, error, reminder',
  })
  type?: string;

  @ApiPropertyOptional({ description: 'Is notification read', default: false })
  @IsOptional()
  @IsBoolean({ message: 'Read status must be a boolean' })
  isRead?: boolean;

  @ApiPropertyOptional({ description: 'Action URL for notification' })
  @IsOptional()
  @IsString({ message: 'Action URL must be a string' })
  @MaxLength(500, { message: 'Action URL cannot exceed 500 characters' })
  actionUrl?: string;

  @ApiPropertyOptional({ description: 'Notification metadata' })
  @IsOptional()
  @IsObject({ message: 'Metadata must be a valid object' })
  metadata?: any;

  @ApiPropertyOptional({ description: 'Read timestamp' })
  @IsOptional()
  @IsDateString({}, { message: 'Read date must be a valid ISO date string' })
  readAt?: string;
}
