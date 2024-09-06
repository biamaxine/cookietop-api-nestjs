import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExternalNetworkDto } from 'src/shared/classes/external-network';
import { NotificationSettingsDto } from 'src/shared/classes/notification-settings';
import { PrivacySettingsDto } from 'src/shared/classes/privacy-settings.class';
import { ProfileSettingsDto } from 'src/shared/classes/profile-settings';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileSettingsDto)
  profileSettings?: ProfileSettingsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacySettings?: PrivacySettingsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  notificationSettings?: NotificationSettingsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ExternalNetworkDto)
  externalNetwork?: ExternalNetworkDto;

  @IsString()
  @IsNotEmpty()
  password: string;
}
