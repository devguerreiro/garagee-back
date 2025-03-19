import { Module } from '@nestjs/common';

import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RegisterModule } from './modules/register/register.module';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true }), RegisterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
