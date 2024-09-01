import { Prop } from '@nestjs/mongoose';

export class ProfileSettings {
  @Prop({ default: '' })
  bio: string;

  @Prop({ default: [] })
  interests: string[];
}
