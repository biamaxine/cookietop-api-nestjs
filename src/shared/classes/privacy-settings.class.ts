import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class PrivacySettings {
  @Prop({
    enum: ['public', 'onlyFriends', 'friendsOfFriends', 'private'],
    default: 'public',
  })
  visibility: 'public' | 'onlyFriends' | 'friendsOfFriends' | 'private';

  @Prop({ default: false })
  showEmail: boolean;
}

export class PrivacySettingsDto implements Partial<PrivacySettings> {
  @IsOptional()
  @IsString()
  @IsIn(['public', 'onlyFriends', 'friendsOfFriends', 'private'])
  visibility?: 'public' | 'onlyFriends' | 'friendsOfFriends' | 'private';

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;
}
