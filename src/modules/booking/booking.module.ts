import { Module } from '@nestjs/common';

import { NotificationModule } from 'src/modules/notification/notification.module';

import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [NotificationModule],
  exports: [BookingService],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
