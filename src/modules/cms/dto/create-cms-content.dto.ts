import {
  IsString,
  IsOptional,
  IsDateString,
  IsIn,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCmsContentDto {
  @ApiProperty({ description: 'Content type', example: 'faq' })
  @IsString({ message: 'Type must be a string' })
  @MinLength(2, { message: 'Type must be at least 2 characters long' })
  @MaxLength(50, { message: 'Type cannot exceed 50 characters' })
  type: string;

  @ApiProperty({ description: 'Content title' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
  title: string;

  @ApiPropertyOptional({ description: 'Content body' })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiPropertyOptional({ description: 'URL slug' })
  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  @MinLength(2, { message: 'Slug must be at least 2 characters long' })
  @MaxLength(255, { message: 'Slug cannot exceed 255 characters' })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Content status',
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'], {
    message: 'Status must be one of: draft, published, archived',
  })
  status?: string;

  @ApiPropertyOptional({ description: 'Author ID' })
  @IsOptional()
  @IsUUID(4, { message: 'Author ID must be a valid UUID' })
  authorId?: string;

  @ApiPropertyOptional({ description: 'Publication date' })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Published date must be a valid ISO date string' },
  )
  publishedAt?: string;
}
