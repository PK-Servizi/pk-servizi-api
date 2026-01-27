import {
  IsString,
  IsOptional,
  IsIn,
  IsUUID,
  IsDateString,
  MaxLength,
  Allow,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceRequestDto {
  @ApiPropertyOptional({ description: 'User ID (auto-populated from auth)' })
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Service ID or code (can use query param instead)',
  })
  @IsOptional()
  @IsString()
  serviceId?: string;

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

  @ApiPropertyOptional({ description: 'Form data as JSON string or object' })
  @IsOptional()
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

  // File upload fields - handled by FileFieldsInterceptor
  @ApiPropertyOptional({ description: 'Identity document file' })
  @IsOptional()
  @Allow()
  identityDocument?: any;

  @ApiPropertyOptional({ description: 'Fiscal code document file' })
  @IsOptional()
  @Allow()
  fiscalCode?: any;

  @ApiPropertyOptional({ description: 'Income documents (max 5)' })
  @IsOptional()
  @Allow()
  incomeDocuments?: any;

  @ApiPropertyOptional({ description: 'Property documents (max 3)' })
  @IsOptional()
  @Allow()
  propertyDocuments?: any;

  @ApiPropertyOptional({ description: 'Disability certificates (max 2)' })
  @IsOptional()
  @Allow()
  disabilityCertificates?: any;

  @ApiPropertyOptional({ description: 'Family documents (max 5)' })
  @IsOptional()
  @Allow()
  familyDocuments?: any;

  @ApiPropertyOptional({ description: 'Other documents (max 10)' })
  @IsOptional()
  @Allow()
  otherDocuments?: any;
}
