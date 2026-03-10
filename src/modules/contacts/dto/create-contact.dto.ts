import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateContactDto {
  @ApiProperty({ example: 'Mario Rossi', description: 'Full name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({ example: 'mario@example.com', description: 'Email address' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiPropertyOptional({ example: '+39 333 1234567', description: 'Phone number (optional)' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @ApiProperty({ example: 'Information about ISEE service', description: 'Message subject' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  @Transform(({ value }) => value?.trim())
  subject: string;

  @ApiProperty({ example: 'I would like more information about...', description: 'Message body' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  @Transform(({ value }) => value?.trim())
  message: string;
}
