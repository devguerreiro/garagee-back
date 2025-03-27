import { Module } from '@nestjs/common';

import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingRepository } from './booking.repository';

@Module({
  exports: [BookingService],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
