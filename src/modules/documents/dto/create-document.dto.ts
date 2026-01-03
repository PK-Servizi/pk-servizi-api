import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsIn,
  IsUUID,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Service request ID' })
  @IsUUID(4, { message: 'Service request ID must be a valid UUID' })
  serviceRequestId: string;

  @ApiProperty({
    description: 'Document category',
    example: 'documento_identita',
  })
  @IsString({ message: 'Category must be a string' })
  @MinLength(2, { message: 'Category must be at least 2 characters long' })
  @MaxLength(100, { message: 'Category cannot exceed 100 characters' })
  category: string;

  @ApiProperty({ description: 'File name' })
  @IsString({ message: 'Filename must be a string' })
  @MinLength(1, { message: 'Filename cannot be empty' })
  @MaxLength(255, { message: 'Filename cannot exceed 255 characters' })
  filename: string;

  @ApiProperty({ description: 'Original file name' })
  @IsString({ message: 'Original filename must be a string' })
  @MinLength(1, { message: 'Original filename cannot be empty' })
  @MaxLength(255, { message: 'Original filename cannot exceed 255 characters' })
  originalFilename: string;

  @ApiProperty({ description: 'File path' })
  @IsString({ message: 'File path must be a string' })
  @MinLength(1, { message: 'File path cannot be empty' })
  @MaxLength(500, { message: 'File path cannot exceed 500 characters' })
  filePath: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsNumber({}, { message: 'File size must be a number' })
  @Min(1, { message: 'File size must be greater than 0' })
  fileSize: number;

  @ApiProperty({ description: 'MIME type', example: 'application/pdf' })
  @IsString({ message: 'MIME type must be a string' })
  @MinLength(1, { message: 'MIME type cannot be empty' })
  @MaxLength(100, { message: 'MIME type cannot exceed 100 characters' })
  mimeType: string;

  @ApiPropertyOptional({
    description: 'Document status',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected'], {
    message: 'Status must be one of: pending, approved, rejected',
  })
  status?: string;

  @ApiPropertyOptional({ description: 'Is document required', default: false })
  @IsOptional()
  @IsBoolean({ message: 'Required flag must be a boolean' })
  isRequired?: boolean;

  @ApiPropertyOptional({ description: 'Admin notes for document' })
  @IsOptional()
  @IsString({ message: 'Admin notes must be a string' })
  @MaxLength(1000, { message: 'Admin notes cannot exceed 1000 characters' })
  adminNotes?: string;

  @ApiPropertyOptional({ description: 'Document version', default: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'Version must be a number' })
  @Min(1, { message: 'Version must be at least 1' })
  version?: number;
}
