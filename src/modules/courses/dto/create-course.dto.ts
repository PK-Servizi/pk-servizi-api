import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course title' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  title: string;

  @ApiPropertyOptional({ description: 'Course description' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({ description: 'Instructor name' })
  @IsOptional()
  @IsString({ message: 'Instructor must be a string' })
  @MaxLength(255, { message: 'Instructor name cannot exceed 255 characters' })
  instructor?: string;

  @ApiPropertyOptional({ description: 'Course duration in hours' })
  @IsOptional()
  @IsNumber({}, { message: 'Duration hours must be a number' })
  @Min(1, { message: 'Duration must be at least 1 hour' })
  durationHours?: number;

  @ApiProperty({ description: 'Course price in EUR' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with max 2 decimal places' },
  )
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiPropertyOptional({ description: 'Is the course active?', default: true })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Course thumbnail URL' })
  @IsOptional()
  @IsString({ message: 'Thumbnail URL must be a string' })
  @MaxLength(255, { message: 'Thumbnail URL cannot exceed 255 characters' })
  thumbnailUrl?: string;
}
