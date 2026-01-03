import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({
    description: 'Required documents list',
    example: ['documento_identita', 'codice_fiscale'],
  })
  @IsOptional()
  @IsObject({ message: 'Required documents must be a valid object' })
  requiredDocuments?: any;

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
