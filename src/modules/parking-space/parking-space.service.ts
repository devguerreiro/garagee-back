import { Injectable } from '@nestjs/common';

import { ParkingSpaceRepository } from './parking-space.repository';

@Injectable()
export class ParkingSpaceService {
  constructor(
    private readonly parkingSpaceRepository: ParkingSpaceRepository,
  ) {}

  async getParkingSpacesByApartmentId(apartmentId: string) {
    return await this.parkingSpaceRepository.getParkingSpacesByApartmentId(
      apartmentId,
    );
  }

  async getParkingSpaceDetail(publicId: string) {
    return await this.parkingSpaceRepository.getParkingSpaceDetail(publicId);
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

  async isParkingSpaceOwner(publicId: string, userPublicId: string) {
    const parkingSpace =
      await this.parkingSpaceRepository.getParkingSpaceDetail(publicId);
    return parkingSpace.apartment.users.some(
      (user) => user.public_id === userPublicId,
    );
  }

  async getParkingSpacesByOwner(ownerPublicId: string) {
    return await this.parkingSpaceRepository.getParkingSpacesByOwner(
      ownerPublicId,
    );
  }
}
