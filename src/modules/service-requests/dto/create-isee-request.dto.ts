import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  IsDate,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class FamilyMemberDto {
  @ApiProperty({ description: 'Full name of the family member', example: 'Mario Rossi' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Fiscal code', example: 'RSSMRA85M01H501Z' })
  @IsString()
  fiscalCode: string;

  @ApiProperty({ description: 'Relationship to the applicant', example: 'Spouse' })
  @IsString()
  relationship: string;

  @ApiProperty({ description: 'Date of birth', example: '1985-05-01' })
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @ApiPropertyOptional({ description: 'Is cohabiting?', default: true })
  @IsOptional()
  cohabiting?: boolean;
}

class ResidenceDto {
  @ApiPropertyOptional({ description: 'Street address', example: 'Via Roma 123' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Municipality', example: 'Milano' })
  @IsString()
  @IsOptional()
  municipality?: string;

  @ApiPropertyOptional({ description: 'Postal code', example: '20100' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Property ownership type', example: 'Owned' })
  @IsString()
  @IsOptional()
  propertyType?: string;
}

class IncomeSourceDto {
  @ApiProperty({ description: 'Type of income', example: 'Employment' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Annual amount', example: 30000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Tax year', example: 2024 })
  @IsNumber()
  year: number;
}

class VehicleDto {
  @ApiProperty({ description: 'License plate', example: 'AB123CD' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ description: 'Year of registration', example: 2020 })
  @IsNumber()
  registrationYear: number;

  @ApiProperty({ description: 'Vehicle type', example: 'Car' })
  @IsString()
  type: string;
}

class UniversityStudentDto {
  @ApiProperty({ description: 'Student name', example: 'Luigi Rossi' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'University name', example: 'Politecnico di Milano' })
  @IsString()
  university: string;

  @ApiProperty({ description: 'Degree course', example: 'Computer Engineering' })
  @IsString()
  degree: string;
}

class MinorDto {
  @ApiProperty({ description: 'Minor name', example: 'Anna Rossi' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Date of birth', example: '2015-05-01' })
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({ description: 'Parental status', example: 'Both parents' })
  @IsString()
  parentalStatus: string;
}

export class CreateIseeRequestDto {
  @ApiProperty({ description: 'Service Type ID', example: 'c42e6d62-1234-5678-9abc-def123456789' })
  @IsString()
  serviceTypeId: string;

  @ApiPropertyOptional({ type: [FamilyMemberDto], description: 'List of family members' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FamilyMemberDto)
  @IsOptional()
  familyMembers?: FamilyMemberDto[];

  @ApiPropertyOptional({ type: ResidenceDto, description: 'Residence details' })
  @ValidateNested()
  @Type(() => ResidenceDto)
  @IsOptional()
  residence?: ResidenceDto;

  @ApiPropertyOptional({ description: 'Income for year 1', example: 25000 })
  @IsNumber()
  @IsOptional()
  incomeYear1?: number;

  @ApiPropertyOptional({ description: 'Income for year 2', example: 28000 })
  @IsNumber()
  @IsOptional()
  incomeYear2?: number;

  @ApiPropertyOptional({ type: [IncomeSourceDto], description: 'List of income sources' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeSourceDto)
  @IsOptional()
  incomeSources?: IncomeSourceDto[];

  @ApiPropertyOptional({ description: 'Bank account balance metadata', example: 1 })
  @IsNumber()
  @IsOptional()
  bankAccounts?: number;

  @ApiPropertyOptional({ description: 'Investment value', example: 5000 })
  @IsNumber()
  @IsOptional()
  investments?: number;

  @ApiPropertyOptional({ description: 'Other movable assets', example: {} })
  @IsObject()
  @IsOptional()
  otherMovableAssets?: any;

  @ApiPropertyOptional({ type: [VehicleDto], description: 'List of vehicles' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleDto)
  @IsOptional()
  vehicles?: VehicleDto[];

  @ApiPropertyOptional({ description: 'Has disability?', default: false })
  @IsOptional()
  hasDisability?: boolean;

  @ApiPropertyOptional({ description: 'Type of disability' })
  @IsString()
  @IsOptional()
  disabilityType?: string;

  @ApiPropertyOptional({ description: 'Disability percentage', example: '75%' })
  @IsString()
  @IsOptional()
  disabilityPercentage?: string;

  @ApiPropertyOptional({ type: [UniversityStudentDto], description: 'List of university students' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UniversityStudentDto)
  @IsOptional()
  universityStudents?: UniversityStudentDto[];

  @ApiPropertyOptional({ type: [MinorDto], description: 'List of minors' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MinorDto)
  @IsOptional()
  minors?: MinorDto[];
}

export class UpdateIseeRequestDto {
  @ApiPropertyOptional({ type: [FamilyMemberDto], description: 'List of family members' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FamilyMemberDto)
  @IsOptional()
  familyMembers?: FamilyMemberDto[];

  @ApiPropertyOptional({ type: ResidenceDto, description: 'Residence details' })
  @ValidateNested()
  @Type(() => ResidenceDto)
  @IsOptional()
  residence?: ResidenceDto;

  @ApiPropertyOptional({ description: 'Income for year 1', example: 25000 })
  @IsNumber()
  @IsOptional()
  incomeYear1?: number;

  @ApiPropertyOptional({ description: 'Income for year 2', example: 28000 })
  @IsNumber()
  @IsOptional()
  incomeYear2?: number;

  @ApiPropertyOptional({ type: [IncomeSourceDto], description: 'List of income sources' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeSourceDto)
  @IsOptional()
  incomeSources?: IncomeSourceDto[];

  @ApiPropertyOptional({ description: 'Bank account balance metadata', example: 1 })
  @IsNumber()
  @IsOptional()
  bankAccounts?: number;

  @ApiPropertyOptional({ description: 'Investment value', example: 5000 })
  @IsNumber()
  @IsOptional()
  investments?: number;

  @ApiPropertyOptional({ description: 'Other movable assets', example: {} })
  @IsObject()
  @IsOptional()
  otherMovableAssets?: any;

  @ApiPropertyOptional({ type: [VehicleDto], description: 'List of vehicles' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleDto)
  @IsOptional()
  vehicles?: VehicleDto[];

  @ApiPropertyOptional({ description: 'Has disability?', default: false })
  @IsOptional()
  hasDisability?: boolean;

  @ApiPropertyOptional({ description: 'Type of disability' })
  @IsString()
  @IsOptional()
  disabilityType?: string;

  @ApiPropertyOptional({ description: 'Disability percentage', example: '75%' })
  @IsString()
  @IsOptional()
  disabilityPercentage?: string;

  @ApiPropertyOptional({ type: [UniversityStudentDto], description: 'List of university students' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UniversityStudentDto)
  @IsOptional()
  universityStudents?: UniversityStudentDto[];

  @ApiPropertyOptional({ type: [MinorDto], description: 'List of minors' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MinorDto)
  @IsOptional()
  minors?: MinorDto[];
}
