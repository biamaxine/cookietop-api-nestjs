import { Prop } from '@nestjs/mongoose';

export class ExternalNetwork {
  @Prop({ default: [] })
  socialMedias: string[];

  @Prop()
  website?: string;
}
