import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ParkingSpaceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getParkingSpacesByApartmentId(apartmentId: string) {
    return await this.prismaService.parkingSpace.findMany({
      where: {
        apartment_id: apartmentId,
        deleted_at: null,
      },
      select: {
        public_id: true,
        identifier: true,
        apartment: {
          select: {
            public_id: true,
            identifier: true,
            tower: {
              select: {
                public_id: true,
                identifier: true,
                building: {
                  select: {
                    public_id: true,
                    name: true,
                  },
                },
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
        apartment: {
          select: {
            public_id: true,
            identifier: true,
            tower: {
              select: {
                public_id: true,
                identifier: true,
                building: {
                  select: {
                    public_id: true,
                    name: true,
                  },
                },
              },
            },
            users: {
              select: { public_id: true },
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
        apartment: {
          select: {
            public_id: true,
            identifier: true,
            tower: {
              select: {
                public_id: true,
                identifier: true,
                building: {
                  select: {
                    public_id: true,
                    name: true,
                  },
                },
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
        apartment: {
          users: {
            some: {
              public_id: ownerPublicId,
            },
          },
        },
        deleted_at: null,
      },
      select: {
        public_id: true,
        identifier: true,
        guidance: true,
        is_covered: true,
        is_blocked: true,
        apartment: {
          select: {
            public_id: true,
            identifier: true,
            tower: {
              select: {
                public_id: true,
                identifier: true,
                building: {
                  select: {
                    public_id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
