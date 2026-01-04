import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceRequestStatusDto {
  @ApiProperty({ enum: ['DRAFT', 'SUBMITTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'] })
  @IsEnum(['DRAFT', 'SUBMITTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'])
  status: string;

  @ApiProperty({ required: false })
  @IsString()
  notes?: string;
}

export class AssignOperatorDto {
  @ApiProperty()
  @IsString()
  operatorId: string;
}

export class UpdatePriorityDto {
  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] })
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority: string;
}