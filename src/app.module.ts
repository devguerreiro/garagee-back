import { Module } from '@nestjs/common';

import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { RegisterModule } from './modules/register/register.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ParkingSpaceModule } from './modules/parking-space/parking-space.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    RegisterModule,
    AuthModule,
    UserModule,
    ParkingSpaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
