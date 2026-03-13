import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  idCardNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  idCardExpiry?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  passportExpiry?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  employer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  monthlyIncome?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  emergencyContactRelationship?: string;

  @ApiProperty({ required: false, default: 'it' })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiProperty({ required: false, default: 'email' })
  @IsOptional()
  @IsString()
  preferredCommunication?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;
}
