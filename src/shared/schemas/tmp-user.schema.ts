import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

@Schema({ collection: 'tmp_users' })
export class TmpUser extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const TmpUserSchema = SchemaFactory.createForClass(TmpUser);

TmpUserSchema.index({ createAt: 1 }, { expires: '1d' });

TmpUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const hash = await bcrypt.hash(this['password'], 10);
    this['password'] = hash;

    next();
  } catch (err) {
    next(err);
  }
});
