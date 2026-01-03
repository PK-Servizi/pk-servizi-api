import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceRequestStatusDto {
  @ApiProperty({
    description: 'New status for the service request',
    enum: [
      'draft',
      'submitted',
      'in_review',
      'missing_documents',
      'completed',
      'rejected',
    ],
  })
  @IsIn(
    [
      'draft',
      'submitted',
      'in_review',
      'missing_documents',
      'completed',
      'rejected',
    ],
    {
      message:
        'Status must be one of: draft, submitted, in_review, missing_documents, completed, rejected',
    },
  )
  status: string;

  @ApiPropertyOptional({ description: 'Notes about the status change' })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(1000, { message: 'Notes cannot exceed 1000 characters' })
  notes?: string;
}
