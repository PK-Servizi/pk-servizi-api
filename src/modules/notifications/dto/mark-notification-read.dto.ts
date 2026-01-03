import { IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MarkNotificationReadDto {
  @ApiPropertyOptional({ description: 'Mark as read', default: true })
  @IsOptional()
  @IsBoolean({ message: 'Read status must be a boolean' })
  isRead?: boolean;

  @ApiPropertyOptional({ description: 'Read timestamp' })
  @IsOptional()
  @IsDateString({}, { message: 'Read date must be a valid ISO date string' })
  readAt?: string;
}
