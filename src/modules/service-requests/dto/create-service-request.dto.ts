import {
  IsString,
  IsOptional,
  IsObject,
  IsIn,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceRequestDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({ description: 'Service type ID' })
  @IsUUID(4, { message: 'Service type ID must be a valid UUID' })
  serviceTypeId: string;

  @ApiPropertyOptional({
    description: 'Request status',
    enum: [
      'draft',
      'submitted',
      'in_review',
      'missing_documents',
      'completed',
      'rejected',
    ],
    default: 'draft',
  })
  @IsOptional()
  @IsIn(
    [
      'draft',
      'submitted',
      'in_review',
      'in_progress',
      'missing_documents',
      'completed',
      'rejected',
    ],
    {
      message:
        'Status must be one of: draft, submitted, in_review, missing_documents, completed, rejected',
    },
  )
  status?: string;

  @ApiPropertyOptional({ description: 'Form data as JSON object' })
  @IsOptional()
  @IsObject({ message: 'Form data must be a valid object' })
  formData?: any;

  @ApiPropertyOptional({ description: 'Internal notes for operators' })
  @IsOptional()
  @IsString({ message: 'Internal notes must be a string' })
  @MaxLength(2000, { message: 'Internal notes cannot exceed 2000 characters' })
  internalNotes?: string;

  @ApiPropertyOptional({ description: 'User notes' })
  @IsOptional()
  @IsString({ message: 'User notes must be a string' })
  @MaxLength(1000, { message: 'User notes cannot exceed 1000 characters' })
  userNotes?: string;

  @ApiPropertyOptional({ description: 'Assigned operator ID' })
  @IsOptional()
  @IsUUID(4, { message: 'Assigned operator ID must be a valid UUID' })
  assignedOperatorId?: string;

  @ApiPropertyOptional({
    description: 'Request priority',
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  })
  @IsOptional()
  @IsIn(['low', 'normal', 'high', 'urgent'], {
    message: 'Priority must be one of: low, normal, high, urgent',
  })
  priority?: string;

  @ApiPropertyOptional({ description: 'Submission date' })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Submitted date must be a valid ISO date string' },
  )
  submittedAt?: string;

  @ApiPropertyOptional({ description: 'Completion date' })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Completed date must be a valid ISO date string' },
  )
  completedAt?: string;
}
