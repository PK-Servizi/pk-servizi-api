import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiPropertyOptional({
    description: 'Service ID (optional - leave empty for general FAQs, or provide a valid service UUID)',
    example: '',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiProperty({
    description: 'FAQ question',
    example: 'What documents do I need for ISEE calculation?',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  question: string;

  @ApiProperty({
    description: 'FAQ answer',
    example:
      'You will need: Identity document, Fiscal code, Income documents...',
  })
  @IsString()
  answer: string;

  @ApiPropertyOptional({
    description: 'Display order (lower numbers appear first)',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({
    description: 'FAQ category',
    example: 'Documents',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({
    description: 'Is FAQ active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
