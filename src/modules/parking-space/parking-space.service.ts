import { Injectable } from '@nestjs/common';

import { ParkingSpaceRepository } from './parking-space.repository';

@Injectable()
export class ParkingSpaceService {
  constructor(
    private readonly parkingSpaceRepository: ParkingSpaceRepository,
  ) {}

  async getParkingSpacesByApartment(
    apartmentPublicId: string,
    isCovered?: boolean,
  ) {
    const where: {
      apartment_id: string;
      is_covered?: boolean;
    } = {
      apartment_id: apartmentPublicId,
    };
    if (isCovered !== undefined) {
      where['is_covered'] = isCovered;
    }
    return await this.parkingSpaceRepository.getParkingSpaces(where);
  }

  async getParkingSpaceDetail(publicId: string) {
    return await this.parkingSpaceRepository.getParkingSpace({
      public_id: publicId,
    });
  }

  async blockParkingSpace(publicId: string) {
    await this.parkingSpaceRepository.updateParkingSpace(
      {
        is_blocked: true,
      },
      {
        public_id: publicId,
      },
    );
  }

  async unblockParkingSpace(publicId: string) {
    await this.parkingSpaceRepository.updateParkingSpace(
      {
        is_blocked: false,
      },
      {
        public_id: publicId,
      },
    );
  }

  async isParkingSpaceOccupant(publicId: string, userPublicId: string) {
    const parkingSpace = await this.parkingSpaceRepository.getParkingSpace({
      public_id: publicId,
    });
    const occupant = parkingSpace.apartment.occupant;
    return occupant && occupant.public_id === userPublicId;
  }

  async getParkingSpaceByOccupant(occupantPublicId: string) {
    return await this.parkingSpaceRepository.getFirstParkingSpace({
      apartment: {
        occupant: {
          public_id: occupantPublicId,
        },
      },
    });
  }
}
