import { Injectable } from '@nestjs/common';

import { ParkingSpaceRepository } from './parking-space.repository';

@Injectable()
export class ParkingSpaceService {
  constructor(
    private readonly parkingSpaceRepository: ParkingSpaceRepository,
  ) {}

  async getParkingSpacesByBuilding(buildingId: number) {
    return await this.parkingSpaceRepository.getParkingSpacesByBuilding(
      buildingId,
    );
  }
}
