import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsNumber,
  IsArray,
  Min,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DocumentRequirement {
  @ApiProperty({ description: 'Field name for upload', example: 'identityDocument' })
  @IsString()
  fieldName: string;

  @ApiProperty({ description: 'Display label', example: 'Identity Document' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Document type code', example: 'IDENTITY' })
  @IsString()
  documentType: string;

  @ApiProperty({ description: 'Is this document required?', example: true })
  @IsBoolean()
  required: boolean;

  @ApiPropertyOptional({ description: 'Max number of files', example: 1 })
  @IsOptional()
  @IsNumber()
  maxCount?: number;

  @ApiPropertyOptional({ 
    description: 'Allowed MIME types',
    example: ['application/pdf', 'image/jpeg'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  allowedMimeTypes?: string[];

  @ApiPropertyOptional({ description: 'Max file size in bytes', example: 5242880 })
  @IsOptional()
  @IsNumber()
  maxSizeBytes?: number;

  @ApiPropertyOptional({ description: 'Help text for user', example: 'Valid ID card or passport' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateServiceTypeDto {
  @ApiProperty({ description: 'Service type name', example: 'ISEE' })
  @IsString({ message: 'Service name must be a string' })
  @MinLength(2, { message: 'Service name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Service name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({ description: 'Service code', example: 'ISEE' })
  @IsString({ message: 'Service code must be a string' })
  @MinLength(2, { message: 'Service code must be at least 2 characters long' })
  @MaxLength(20, { message: 'Service code cannot exceed 20 characters' })
  code: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @ApiPropertyOptional({ description: 'Service category', example: 'TAX' })
  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @MaxLength(50, { message: 'Category cannot exceed 50 characters' })
  category?: string;

  @ApiPropertyOptional({ description: 'Base price in euros', example: 50.00 })
  @IsOptional()
  @IsNumber({}, { message: 'Base price must be a number' })
  @Min(0, { message: 'Base price must be positive' })
  basePrice?: number;

  @ApiPropertyOptional({
    description: 'Required documents list (legacy - use documentRequirements instead)',
    example: ['identityDocument', 'fiscalCode'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  requiredDocuments?: string[];

  @ApiPropertyOptional({ 
    description: 'Detailed document requirements with validation rules',
    type: [DocumentRequirement]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentRequirement)
  documentRequirements?: DocumentRequirement[];

  @ApiPropertyOptional({
    description: 'Form schema configuration',
    example: {
      sections: [{ name: 'dati_anagrafici', fields: ['nome', 'cognome'] }],
    },
  })
  @IsOptional()
  @IsObject({ message: 'Form schema must be a valid object' })
  formSchema?: any;

  @ApiPropertyOptional({ description: 'Is service active', default: true })
  @IsOptional()
  @IsBoolean({ message: 'Active status must be a boolean' })
  isActive?: boolean;
}
