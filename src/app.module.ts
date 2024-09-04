import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TmpUserModule } from './routes/tmp-user/tmp-user.module';
import { UserModule } from './routes/user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@thebestcluster.bz8s21o.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=TheBestCluster`,
    ),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: +process.env.MAILER_PORT,
        secure: false,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
      },
      defaults: {
        from: `"CookieTop" <${process.env.MAILER_USER}>`,
      },
    }),
    TmpUserModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
