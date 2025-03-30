import { Module } from '@nestjs/common';

import { UserModule } from 'src/modules/user/user.module';

import { ParkingSpaceService } from './parking-space.service';
import { ParkingSpaceRepository } from './parking-space.repository';
import { ParkingSpaceController } from './parking-space.controller';

@Module({
  imports: [UserModule],
  controllers: [ParkingSpaceController],
  providers: [ParkingSpaceService, ParkingSpaceRepository],
})
export class ParkingSpaceModule {}
