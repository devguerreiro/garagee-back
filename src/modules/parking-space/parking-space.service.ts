import { Injectable } from '@nestjs/common';

import { ParkingSpaceRepository } from './parking-space.repository';
import { UpdateParkingSpaceDTO } from './parking-space.dto';

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

  async updateParkingSpace(publicId: string, data: UpdateParkingSpaceDTO) {
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
