import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TmpUserModule } from './routes/tmp-user/tmp-user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@thebestcluster.bz8s21o.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=TheBestCluster`,
    ),
    TmpUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
