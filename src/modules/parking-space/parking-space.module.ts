import { Module } from '@nestjs/common';

import { UserModule } from 'src/modules/user/user.module';
import { BookingModule } from 'src/modules/booking/booking.module';

import { ParkingSpaceService } from './parking-space.service';
import { ParkingSpaceController } from './parking-space.controller';

@Module({
  imports: [UserModule, BookingModule],
  controllers: [ParkingSpaceController],
  providers: [ParkingSpaceService],
})
export class ParkingSpaceModule {}
