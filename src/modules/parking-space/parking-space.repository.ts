import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ParkingSpaceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getParkingSpacesByBuilding(buildingId: number) {
    return await this.prismaService.parkingSpace.findMany({
      where: {
        owner: {
          building_id: buildingId,
        },
      },
      select: {
        public_id: true,
        identifier: true,
        owner: {
          select: {
            public_id: true,
            name: true,
            apartment: true,
            building: {
              select: {
                public_id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
