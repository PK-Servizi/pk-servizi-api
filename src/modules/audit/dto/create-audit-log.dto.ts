import {
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuditLogDto {
  @ApiPropertyOptional({ description: 'User ID who performed the action' })
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId?: string;

  @ApiProperty({ description: 'Action performed' })
  @IsString({ message: 'Action must be a string' })
  @MinLength(2, { message: 'Action must be at least 2 characters long' })
  @MaxLength(100, { message: 'Action cannot exceed 100 characters' })
  action: string;

  @ApiProperty({ description: 'Resource type affected' })
  @IsString({ message: 'Resource type must be a string' })
  @MinLength(2, { message: 'Resource type must be at least 2 characters long' })
  @MaxLength(50, { message: 'Resource type cannot exceed 50 characters' })
  resourceType: string;

  @ApiPropertyOptional({ description: 'Resource ID affected' })
  @IsOptional()
  @IsUUID(4, { message: 'Resource ID must be a valid UUID' })
  resourceId?: string;

  @ApiPropertyOptional({ description: 'Old values before change' })
  @IsOptional()
  @IsObject({ message: 'Old values must be a valid object' })
  oldValues?: any;

  @ApiPropertyOptional({ description: 'New values after change' })
  @IsOptional()
  @IsObject({ message: 'New values must be a valid object' })
  newValues?: any;

  @ApiPropertyOptional({ description: 'IP address of the user' })
  @IsOptional()
  @IsString({ message: 'IP address must be a string' })
  @MaxLength(45, { message: 'IP address cannot exceed 45 characters' })
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString({ message: 'User agent must be a string' })
  @MaxLength(1000, { message: 'User agent cannot exceed 1000 characters' })
  userAgent?: string;
}
