import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ParkingSpaceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getParkingSpaces(where: Prisma.ParkingSpaceWhereInput) {
    return await this.prismaService.parkingSpace.findMany({
      where: {
        ...where,
      },
      select: {
        public_id: true,
        identifier: true,
        apartment: {
          select: {
            identifier: true,
            tower: {
              select: {
                building: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            occupant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getParkingSpace(where: Prisma.ParkingSpaceWhereUniqueInput) {
    return await this.prismaService.parkingSpace.findUniqueOrThrow({
      where,
      select: {
        public_id: true,
        identifier: true,
        guidance: true,
        is_covered: true,
        is_blocked: true,
        apartment: {
          select: {
            identifier: true,
            tower: {
              select: {
                building: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            occupant: {
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
    data: Prisma.ParkingSpaceUpdateInput,
    where: Prisma.ParkingSpaceWhereUniqueInput,
  ) {
    return await this.prismaService.parkingSpace.update({
      data,
      where,
      select: {
        identifier: true,
        guidance: true,
        is_covered: true,
        apartment: {
          select: {
            identifier: true,
            tower: {
              select: {
                building: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            occupant: {
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

  async getFirstParkingSpace(where: Prisma.ParkingSpaceWhereInput) {
    return await this.prismaService.parkingSpace.findFirstOrThrow({
      where,
      select: {
        public_id: true,
        identifier: true,
        apartment: {
          select: {
            identifier: true,
            tower: {
              select: {
                building: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            occupant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
