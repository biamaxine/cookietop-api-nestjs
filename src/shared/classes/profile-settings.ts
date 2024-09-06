import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProfileSettings {
  @Prop({ default: '' })
  bio: string;

  @Prop({ default: [] })
  interests: string[];
}

export class ProfileSettingsDto implements Partial<ProfileSettings> {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  interests?: string[];
}
