import { Module } from '@nestjs/common';

import { UserModule } from 'src/modules/user/user.module';
import { BookingModule } from 'src/modules/booking/booking.module';

import { ParkingSpaceService } from './parking-space.service';
import { ParkingSpaceRepository } from './parking-space.repository';
import { ParkingSpaceController } from './parking-space.controller';

@Module({
  imports: [UserModule, BookingModule],
  controllers: [ParkingSpaceController],
  providers: [ParkingSpaceService, ParkingSpaceRepository],
})
export class ParkingSpaceModule {}
