import {
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsNumber,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CadastralDataDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cadastralMunicipality?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  section?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sheet?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  parcel?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subparcel?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cadastralCategory?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cadastralClass?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  rentValue?: number;
}

class PropertyDataDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ type: CadastralDataDto })
  @ValidateNested()
  @Type(() => CadastralDataDto)
  @IsOptional()
  cadastralData?: CadastralDataDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  purchaseDate?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  purchasePrice?: number;
}

class PropertyUsageDto {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty()
  @IsString()
  usage: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  percentage?: number;
}

class ExemptionDto {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  year: number;
}

class VariationDto {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty()
  @IsString()
  variationType: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsString()
  details: string;
}

class ImuPaymentDto {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  paymentDate?: Date;

  @ApiPropertyOptional({ enum: ['paid', 'unpaid', 'partial'] })
  @IsString()
  @IsOptional()
  status?: 'paid' | 'unpaid' | 'partial';
}

class InheritedPropertyDto {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty()
  @IsNumber()
  inheritancePercentage: number;
}

class InheritanceDataDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  inheritor?: string;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  inheritanceDate?: Date;

  @ApiPropertyOptional({ type: [InheritedPropertyDto] })
  @IsArray()
  @IsOptional()
  inheritedProperties?: InheritedPropertyDto[];
}

export class CreateImuRequestDto {
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
  @IsString()
  @IsOptional()
  taxpayerType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  municipality?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ type: [PropertyDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDataDto)
  @IsOptional()
  properties?: PropertyDataDto[];

  @ApiPropertyOptional({ type: [PropertyUsageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyUsageDto)
  @IsOptional()
  propertyUsage?: PropertyUsageDto[];

  @ApiPropertyOptional({ type: [ExemptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExemptionDto)
  @IsOptional()
  exemptions?: ExemptionDto[];

  @ApiPropertyOptional({ type: [VariationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationDto)
  @IsOptional()
  variations?: VariationDto[];

  @ApiPropertyOptional({ type: [ImuPaymentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImuPaymentDto)
  @IsOptional()
  imuPayments?: ImuPaymentDto[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  hasInheritance?: boolean;

  @ApiPropertyOptional({ type: InheritanceDataDto })
  @ValidateNested()
  @Type(() => InheritanceDataDto)
  @IsOptional()
  inheritanceData?: InheritanceDataDto;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  taxYear?: number;
}

export class UpdateImuRequestDto {
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
  @IsString()
  @IsOptional()
  taxpayerType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  municipality?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ type: [PropertyDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDataDto)
  @IsOptional()
  properties?: PropertyDataDto[];

  @ApiPropertyOptional({ type: [PropertyUsageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyUsageDto)
  @IsOptional()
  propertyUsage?: PropertyUsageDto[];

  @ApiPropertyOptional({ type: [ExemptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExemptionDto)
  @IsOptional()
  exemptions?: ExemptionDto[];

  @ApiPropertyOptional({ type: [VariationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationDto)
  @IsOptional()
  variations?: VariationDto[];

  @ApiPropertyOptional({ type: [ImuPaymentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImuPaymentDto)
  @IsOptional()
  imuPayments?: ImuPaymentDto[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  hasInheritance?: boolean;

  @ApiPropertyOptional({ type: InheritanceDataDto })
  @ValidateNested()
  @Type(() => InheritanceDataDto)
  @IsOptional()
  inheritanceData?: InheritanceDataDto;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  taxYear?: number;
}
