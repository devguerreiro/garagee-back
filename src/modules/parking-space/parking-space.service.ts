import { Injectable } from '@nestjs/common';

import { ParkingSpaceRepository } from './parking-space.repository';

@Injectable()
export class ParkingSpaceService {
  constructor(
    private readonly parkingSpaceRepository: ParkingSpaceRepository,
  ) {}

  async getParkingSpacesByApartment(apartmentPublicId: string) {
    return await this.parkingSpaceRepository.getParkingSpacesByApartment(
      apartmentPublicId,
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

  async isParkingSpaceOccupant(publicId: string, userPublicId: string) {
    const parkingSpace =
      await this.parkingSpaceRepository.getParkingSpaceDetail(publicId);
    const occupant = parkingSpace.apartment.occupant;
    return occupant && occupant.public_id === userPublicId;
  }

  async getParkingSpacesByOccupant(occupantPublicId: string) {
    return await this.parkingSpaceRepository.getParkingSpacesByOccupant(
      occupantPublicId,
    );
  }
}
