import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadMultipleDocumentsDto {
  @ApiProperty({ description: 'Service request ID' })
  @IsUUID(4, { message: 'Service request ID must be a valid UUID' })
  serviceRequestId: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Identity Document',
  })
  @IsOptional()
  identityDocument?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Fiscal Code',
  })
  @IsOptional()
  fiscalCode?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Income Certificate',
  })
  @IsOptional()
  incomeCertificate?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Bank Statement',
  })
  @IsOptional()
  bankStatement?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Property Document',
  })
  @IsOptional()
  propertyDocument?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Visura Catastale',
  })
  @IsOptional()
  visuraCatastale?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Property Deed',
  })
  @IsOptional()
  propertyDeed?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'CU Certificate',
  })
  @IsOptional()
  cuCertificate?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Medical Receipts',
  })
  @IsOptional()
  medicalReceipts?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Expense Receipts',
  })
  @IsOptional()
  expenseReceipts?: any;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Other Document',
  })
  @IsOptional()
  otherDocument?: any;
}
