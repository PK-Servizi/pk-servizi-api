import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsIn,
  IsUUID,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiPropertyOptional({ description: 'Service type ID' })
  @IsOptional()
  @IsUUID(4, { message: 'Service type ID must be a valid UUID' })
  serviceTypeId?: string;

  @ApiPropertyOptional({ description: 'Operator ID' })
  @IsOptional()
  @IsUUID(4, { message: 'Operator ID must be a valid UUID' })
  operatorId?: string;

  @ApiProperty({ description: 'Appointment title' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  title: string;

  @ApiPropertyOptional({ description: 'Appointment description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @ApiProperty({ description: 'Appointment date and time' })
  @IsDateString(
    {},
    { message: 'Appointment date must be a valid ISO date string' },
  )
  appointmentDate: string;

  @ApiPropertyOptional({ description: 'Duration in minutes', default: 60 })
  @IsOptional()
  @IsNumber({}, { message: 'Duration must be a number' })
  @Min(15, { message: 'Duration must be at least 15 minutes' })
  @Max(480, { message: 'Duration cannot exceed 8 hours (480 minutes)' })
  durationMinutes?: number;

  @ApiPropertyOptional({
    description: 'Appointment status',
    enum: [
      'scheduled',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
    ],
    default: 'scheduled',
  })
  @IsOptional()
  @IsIn(
    [
      'scheduled',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'no_show',
    ],
    {
      message:
        'Status must be one of: scheduled, confirmed, in_progress, completed, cancelled, no_show',
    },
  )
  status?: string;

  @ApiPropertyOptional({ description: 'Appointment location' })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  @MaxLength(255, { message: 'Location cannot exceed 255 characters' })
  location?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(1000, { message: 'Notes cannot exceed 1000 characters' })
  notes?: string;
}
