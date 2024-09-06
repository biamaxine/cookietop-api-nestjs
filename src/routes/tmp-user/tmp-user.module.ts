import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { TmpUserSchema } from 'src/shared/schemas/tmp-user.schema';
import { UserSchema } from 'src/shared/schemas/user.schema';

import { TmpUserController } from './tmp-user.controller';
import { TmpUserService } from './tmp-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'TmpUser',
        schema: TmpUserSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [TmpUserService],
  controllers: [TmpUserController],
})
export class TmpUserModule {}
