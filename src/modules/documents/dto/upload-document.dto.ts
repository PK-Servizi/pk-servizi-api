import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty()
  @IsString()
  requestId: string;

  @ApiProperty()
  @IsString()
  documentType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDocumentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class ApproveDocumentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectDocumentDto {
  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddNotesDto {
  @ApiProperty()
  @IsString()
  notes: string;
}