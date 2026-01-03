import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
  IsUUID,
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
  @MaxLength(2000, { message: 'Description cannot exceed 2000 characters' })
  description?: string;

  @ApiPropertyOptional({ description: 'Course content' })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiPropertyOptional({ description: 'Instructor ID' })
  @IsOptional()
  @IsUUID(4, { message: 'Instructor ID must be a valid UUID' })
  instructorId?: string;

  @ApiPropertyOptional({ description: 'Maximum number of participants' })
  @IsOptional()
  @IsNumber({}, { message: 'Max participants must be a number' })
  @Min(1, { message: 'Max participants must be at least 1' })
  maxParticipants?: number;

  @ApiPropertyOptional({ description: 'Course start date' })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  startDate?: string;

  @ApiPropertyOptional({ description: 'Course end date' })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  endDate?: string;

  @ApiPropertyOptional({ description: 'Course location' })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  @MaxLength(255, { message: 'Location cannot exceed 255 characters' })
  location?: string;

  @ApiPropertyOptional({ description: 'Course price in EUR' })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with max 2 decimal places' },
  )
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Course status',
    enum: ['draft', 'published', 'active', 'completed', 'cancelled'],
    default: 'draft',
  })
  @IsOptional()
  @IsIn(['draft', 'published', 'active', 'completed', 'cancelled'], {
    message:
      'Status must be one of: draft, published, active, completed, cancelled',
  })
  status?: string;
}
