import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TmpUserSchema } from 'src/shared/schemas/tmp-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TmpUser',
        schema: TmpUserSchema,
      },
    ]),
  ],
})
export class TmpUserModule {}
