import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'mario.rossi@example.com',
    maxLength: 255,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({
    description:
      'Password of the user. Must contain at least one uppercase letter, one lowercase letter, and one number.',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 128,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Mario',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-Z\u00c0-\u00ff\s']+$/, {
    message: 'First name can only contain letters, spaces and apostrophes',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Rossi',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-Z\u00c0-\u00ff\s']+$/, {
    message: 'Last name can only contain letters, spaces and apostrophes',
  })
  lastName: string;

  @ApiProperty({
    description: 'Italian fiscal code (Codice Fiscale)',
    example: 'RSSMRA85M01H501Z',
    minLength: 16,
    maxLength: 16,
  })
  @IsString({ message: 'Fiscal code must be a string' })
  @IsNotEmpty({ message: 'Fiscal code is required' })
  @MinLength(16, { message: 'Fiscal code must be 16 characters' })
  @MaxLength(16, { message: 'Fiscal code must be 16 characters' })
  @Matches(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/, {
    message: 'Invalid Italian fiscal code format',
  })
  @Transform(({ value }) => value?.trim().toUpperCase())
  fiscalCode: string;

  @ApiPropertyOptional({
    description: 'Phone number with international format',
    example: '+39 333 1234567',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @MaxLength(20, { message: 'Phone cannot exceed 20 characters' })
  @Matches(/^\+?[0-9\s\-\(\)]+$/, {
    message: 'Phone must be a valid phone number format',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Date of birth in ISO format',
    example: '1985-08-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Street address',
    example: 'Via Roma 123',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(255, { message: 'Address cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  address?: string;

  @ApiPropertyOptional({
    description: 'City name',
    example: 'Milano',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @MaxLength(100, { message: 'City cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  city?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '20100',
    maxLength: 10,
  })
  @IsOptional()
  @IsString({ message: 'Postal code must be a string' })
  @MaxLength(10, { message: 'Postal code cannot exceed 10 characters' })
  @Matches(/^\d{5}$/, { message: 'Postal code must be 5 digits' })
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Province code (2 letters)',
    example: 'MI',
    minLength: 2,
    maxLength: 2,
  })
  @IsOptional()
  @IsString({ message: 'Province must be a string' })
  @MinLength(2, { message: 'Province must be 2 characters' })
  @MaxLength(2, { message: 'Province must be 2 characters' })
  @Matches(/^[A-Z]{2}$/, { message: 'Province must be 2 uppercase letters' })
  @Transform(({ value }) => value?.trim().toUpperCase())
  province?: string;

  @ApiProperty({
    description: 'GDPR consent for data processing',
    example: true,
  })
  @IsBoolean({ message: 'GDPR consent must be a boolean' })
  @IsNotEmpty({ message: 'GDPR consent is required' })
  gdprConsent: boolean;

  @ApiPropertyOptional({
    description: 'Marketing consent for promotional communications',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Marketing consent must be a boolean' })
  marketingConsent?: boolean;
}
