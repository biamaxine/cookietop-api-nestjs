import { Prop } from '@nestjs/mongoose';

export class PrivacySettings {
  @Prop({
    enum: ['public', 'onlyFriends', 'friendsOfFriends', 'private'],
    default: 'public',
  })
  visibility: 'public' | 'onlyFriends' | 'friendsOfFriends' | 'private';

  @Prop({ default: false })
  showEmail: boolean;
}
