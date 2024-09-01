import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ExternalNetwork } from '../classes/external-network';
import { NotificationSettings } from '../classes/notification-settings';
import { PrivacySettings } from '../classes/privacy-settings.class';
import { ProfileSettings } from '../classes/profile-settings';

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: ProfileSettings,
    default: {
      bio: '',
      interests: [],
    },
  })
  profileSettings: ProfileSettings;

  @Prop({
    type: PrivacySettings,
    default: {
      visibility: 'public',
      showEmail: false,
    },
  })
  privacySettings: PrivacySettings;

  @Prop({
    type: NotificationSettings,
    default: {
      emailNotifications: true,
      pushNotifications: true,
    },
  })
  notificationSettings: NotificationSettings;

  @Prop({
    type: ExternalNetwork,
    default: {
      socialMedias: [],
      website: '',
    },
  })
  externalNetwork: ExternalNetwork;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
