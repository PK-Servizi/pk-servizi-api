import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveDocumentDto {
  @ApiProperty({
    description: 'Document approval status',
    enum: ['approved', 'rejected'],
  })
  @IsIn(['approved', 'rejected'], {
    message: 'Status must be either approved or rejected',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Admin notes for the approval/rejection',
  })
  @IsOptional()
  @IsString({ message: 'Admin notes must be a string' })
  @MaxLength(1000, { message: 'Admin notes cannot exceed 1000 characters' })
  adminNotes?: string;
}
