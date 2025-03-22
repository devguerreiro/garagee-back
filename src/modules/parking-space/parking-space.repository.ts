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
        deleted_at: null,
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
    return await this.prismaService.parkingSpace.findUniqueOrThrow({
      where: {
        public_id: publicId,
        deleted_at: null,
      },
      select: {
        public_id: true,
        identifier: true,
        guidance: true,
        is_covered: true,
        is_blocked: true,
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

  async updateParkingSpace(
    publicId: string,
    data: Prisma.ParkingSpaceUpdateInput,
  ) {
    return await this.prismaService.parkingSpace.update({
      data,
      where: {
        public_id: publicId,
        deleted_at: null,
      },
      select: {
        public_id: true,
        identifier: true,
        guidance: true,
        is_covered: true,
        is_blocked: true,
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

  async deleteParkingSpace(publicId: string) {
    await this.prismaService.parkingSpace.update({
      data: {
        deleted_at: new Date(),
      },
      where: {
        public_id: publicId,
        deleted_at: null,
      },
    });
  }

  async getParkingSpacesByOwner(ownerPublicId: string) {
    return await this.prismaService.parkingSpace.findMany({
      where: {
        owner: {
          public_id: ownerPublicId,
        },
        deleted_at: null,
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

  async createParkingSpace(data: Prisma.ParkingSpaceCreateInput) {
    return await this.prismaService.parkingSpace.create({
      data,
      select: {
        public_id: true,
        identifier: true,
        guidance: true,
        is_covered: true,
        is_blocked: true,
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
