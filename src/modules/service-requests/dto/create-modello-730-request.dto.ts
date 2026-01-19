import {
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CuDataDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employer?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  totalIncome?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  taxableIncome?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  taxWithheld?: number;
}

class IncomeItemDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

class PropertyDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cadastralCategory?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rentIncome?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  mortgageInterest?: number;
}

class MedicalDetailDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

class EducationDetailDto {
  @ApiProperty()
  @IsString()
  student: string;

  @ApiProperty()
  @IsString()
  institution: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

class MortgageDto {
  @ApiProperty()
  @IsString()
  lender: string;

  @ApiPropertyOptional()
  @IsOptional()
  principalResidence?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  interest?: number;
}

class HomeBonusDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

class DependentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  fiscalCode: string;

  @ApiProperty()
  @IsString()
  relationship: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}

class LifeInsuranceDto {
  @ApiProperty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsNumber()
  premiumAmount: number;
}

class PensionContributionDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

export class CreateModello730RequestDto {
  @ApiProperty()
  @IsString()
  serviceTypeId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fiscalCode?: string;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  birthPlace?: string;

  @ApiPropertyOptional({ type: CuDataDto })
  @ValidateNested()
  @Type(() => CuDataDto)
  @IsOptional()
  cuData?: CuDataDto;

  @ApiPropertyOptional({ type: [IncomeItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeItemDto)
  @IsOptional()
  inpsIncome?: IncomeItemDto[];

  @ApiPropertyOptional({ type: [IncomeItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeItemDto)
  @IsOptional()
  otherIncome?: IncomeItemDto[];

  @ApiPropertyOptional({ type: [PropertyDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  @IsOptional()
  properties?: PropertyDto[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  medicalExpenses?: number;

  @ApiPropertyOptional({ type: [MedicalDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalDetailDto)
  @IsOptional()
  medicalDetails?: MedicalDetailDto[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  educationExpenses?: number;

  @ApiPropertyOptional({ type: [EducationDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDetailDto)
  @IsOptional()
  educationDetails?: EducationDetailDto[];

  @ApiPropertyOptional({ type: [MortgageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MortgageDto)
  @IsOptional()
  mortgages?: MortgageDto[];

  @ApiPropertyOptional({ type: [HomeBonusDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeBonusDto)
  @IsOptional()
  homeBonus?: HomeBonusDto[];

  @ApiPropertyOptional({ type: [DependentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DependentDto)
  @IsOptional()
  dependents?: DependentDto[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  familyMembersCount?: number;

  @ApiPropertyOptional({ type: [LifeInsuranceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LifeInsuranceDto)
  @IsOptional()
  lifeInsurance?: LifeInsuranceDto[];

  @ApiPropertyOptional({ type: [PensionContributionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PensionContributionDto)
  @IsOptional()
  pensionContributions?: PensionContributionDto[];
}

export class UpdateModello730RequestDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  fiscalCode?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  birthPlace?: string;

  @ValidateNested()
  @Type(() => CuDataDto)
  @IsOptional()
  cuData?: CuDataDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeItemDto)
  @IsOptional()
  inpsIncome?: IncomeItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomeItemDto)
  @IsOptional()
  otherIncome?: IncomeItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  @IsOptional()
  properties?: PropertyDto[];

  @IsNumber()
  @IsOptional()
  medicalExpenses?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalDetailDto)
  @IsOptional()
  medicalDetails?: MedicalDetailDto[];

  @IsNumber()
  @IsOptional()
  educationExpenses?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDetailDto)
  @IsOptional()
  educationDetails?: EducationDetailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MortgageDto)
  @IsOptional()
  mortgages?: MortgageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeBonusDto)
  @IsOptional()
  homeBonus?: HomeBonusDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DependentDto)
  @IsOptional()
  dependents?: DependentDto[];

  @IsNumber()
  @IsOptional()
  familyMembersCount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LifeInsuranceDto)
  @IsOptional()
  lifeInsurance?: LifeInsuranceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PensionContributionDto)
  @IsOptional()
  pensionContributions?: PensionContributionDto[];
}
