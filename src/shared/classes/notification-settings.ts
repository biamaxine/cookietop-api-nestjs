import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsOptional } from 'class-validator';

export class NotificationSettings {
  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: true })
  pushNotifications: boolean;
}

export class NotificationSettingsDto implements Partial<NotificationSettings> {
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;
}
