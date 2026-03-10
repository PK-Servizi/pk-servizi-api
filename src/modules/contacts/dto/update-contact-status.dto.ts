import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactStatusDto {
  @ApiProperty({
    example: 'read',
    enum: ['new', 'read', 'replied'],
    description: 'New status for the contact submission',
  })
  @IsNotEmpty()
  @IsIn(['new', 'read', 'replied'])
  status: 'new' | 'read' | 'replied';

  @ApiPropertyOptional({ example: 'Replied via email on 10/03/2026' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNotes?: string;
}
