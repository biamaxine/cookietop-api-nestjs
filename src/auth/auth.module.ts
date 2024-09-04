import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { TmpUserSchema } from 'src/shared/schemas/tmp-user.schema';
import { UserSchema } from 'src/shared/schemas/user.schema';

import { AuthService } from './auth.service';
import { NodemailerService } from './email/nodemailer.service';
import { JwtStrategy } from './strategies/jwt.strategy.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TmpUser',
        schema: TmpUserSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, NodemailerService],
  exports: [AuthService, NodemailerService],
})
export class AuthModule {}
