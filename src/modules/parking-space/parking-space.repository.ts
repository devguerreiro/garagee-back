import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ParkingSpaceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getParkingSpaces(buildingId: number) {
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

  async getParkingSpaceDetail(publicId: string) {
    return await this.prismaService.parkingSpace.findUnique({
      where: {
        public_id: publicId,
      },
      select: {
        public_id: true,
        identifier: true,
        guidance: true,
        is_covered: true,
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

  async updateParkingSpaceDetail(
    publicId: string,
    data: Prisma.ParkingSpaceUpdateInput,
  ) {
    return await this.prismaService.parkingSpace.update({
      data,
      where: {
        public_id: publicId,
      },
      select: {
        public_id: true,
        identifier: true,
        guidance: true,
        is_covered: true,
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
