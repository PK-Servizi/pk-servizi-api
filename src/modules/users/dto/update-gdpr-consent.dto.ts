import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGdprConsentDto {
  @ApiPropertyOptional({ description: 'General GDPR Consent' })
  @IsBoolean()
  @IsOptional()
  gdprConsent?: boolean;

  @ApiPropertyOptional({ description: 'Privacy Policy Consent' })
  @IsBoolean()
  @IsOptional()
  privacyConsent?: boolean;
}
