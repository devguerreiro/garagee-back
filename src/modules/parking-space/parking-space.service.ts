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
    return await this.parkingSpaceRepository.updateParkingSpace(publicId, data);
  }

  async blockParkingSpace(publicId: string) {
    await this.parkingSpaceRepository.updateParkingSpace(publicId, {
      is_blocked: true,
    });
  }

  async unblockParkingSpace(publicId: string) {
    await this.parkingSpaceRepository.updateParkingSpace(publicId, {
      is_blocked: false,
    });
  }

  async deleteParkingSpace(publicId: string) {
    await this.parkingSpaceRepository.deleteParkingSpace(publicId);
  }

  async isParkingSpaceOwner(publicId: string, userPublicId: string) {
    const parkingSpace =
      await this.parkingSpaceRepository.getParkingSpaceDetail(publicId);
    return parkingSpace.owner.public_id === userPublicId;
  }

  async getParkingSpacesByOwner(ownerPublicId: string) {
    return await this.parkingSpaceRepository.getParkingSpacesByOwner(
      ownerPublicId,
    );
  }
}
