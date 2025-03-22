import { Injectable } from '@nestjs/common';

import { ParkingSpaceRepository } from './parking-space.repository';
import { ParkingSpaceUpdateDTO } from './parking-space.dto';

@Injectable()
export class ParkingSpaceService {
  constructor(
    private readonly parkingSpaceRepository: ParkingSpaceRepository,
  ) {}

  async getParkingSpaces(buildingId: number) {
    return await this.parkingSpaceRepository.getParkingSpaces(buildingId);
  }

  async getParkingSpaceDetail(publicId: string) {
    return await this.parkingSpaceRepository.getParkingSpaceDetail(publicId);
  }

  async updateParkingSpace(publicId: string, data: ParkingSpaceUpdateDTO) {
    return await this.parkingSpaceRepository.updateParkingSpaceDetail(
      publicId,
      data,
    );
  }
}
