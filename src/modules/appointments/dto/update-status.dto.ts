import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsString()
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}