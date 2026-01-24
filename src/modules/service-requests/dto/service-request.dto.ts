import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class NoteDto {
  @ApiProperty({ description: 'Content of the note' })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Type of note',
    enum: ['internal', 'user'],
  })
  @IsOptional()
  @IsString()
  type?: 'internal' | 'user'; // internal for admin/operator, user for customer-visible
}

export class AddNoteDto {
  @ApiProperty({ description: 'Content of the note' })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Type of note',
    enum: ['internal', 'user'],
  })
  @IsString()
  @IsOptional()
  type?: 'internal' | 'user';
}

export class UpdateNoteDto {
  @ApiProperty({ description: 'Updated content of the note' })
  @IsString()
  content: string;
}

export class ListServiceRequestsDto {
  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by service type ID' })
  @IsString()
  @IsOptional()
  serviceTypeId?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned operator ID' })
  @IsString()
  @IsOptional()
  assignedOperatorId?: string;

  @ApiPropertyOptional({ description: 'Filter by priority' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional({ description: 'Number of records to skip' })
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional({ description: 'Number of records to take' })
  @IsOptional()
  take?: number;

  @ApiPropertyOptional({ description: 'Field to sort by' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'] })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

export class SubmitServiceRequestDto {
  @ApiPropertyOptional({ description: 'Optional notes for submission' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class DocumentChecklistDto {
  @ApiProperty({ description: 'Type of document' })
  @IsString()
  documentType: string;

  @ApiProperty({
    description: 'Status of document',
    enum: ['pending', 'uploaded', 'approved', 'rejected'],
  })
  @IsString()
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';

  @ApiPropertyOptional({ description: 'Is document mandatory' })
  @IsOptional()
  mandatory?: boolean;
}
