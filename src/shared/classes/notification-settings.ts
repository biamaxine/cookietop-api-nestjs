import { Prop } from '@nestjs/mongoose';

export class NotificationSettings {
  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: true })
  pushNotifications: boolean;
}
