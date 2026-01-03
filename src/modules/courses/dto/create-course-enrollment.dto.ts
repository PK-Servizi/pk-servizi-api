import {
  IsOptional,
  IsBoolean,
  IsDateString,
  IsIn,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseEnrollmentDto {
  @ApiProperty({ description: 'Course ID' })
  @IsUUID(4, { message: 'Course ID must be a valid UUID' })
  courseId: string;

  @ApiProperty({ description: 'User ID' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiPropertyOptional({ description: 'Enrollment date' })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Enrollment date must be a valid ISO date string' },
  )
  enrollmentDate?: string;

  @ApiPropertyOptional({
    description: 'Enrollment status',
    enum: ['enrolled', 'active', 'completed', 'dropped', 'cancelled'],
    default: 'enrolled',
  })
  @IsOptional()
  @IsIn(['enrolled', 'active', 'completed', 'dropped', 'cancelled'], {
    message:
      'Status must be one of: enrolled, active, completed, dropped, cancelled',
  })
  status?: string;

  @ApiPropertyOptional({ description: 'Course completion date' })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Completion date must be a valid ISO date string' },
  )
  completionDate?: string;

  @ApiPropertyOptional({
    description: 'Certificate issued flag',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Certificate issued must be a boolean' })
  certificateIssued?: boolean;
}
