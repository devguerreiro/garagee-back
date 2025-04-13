import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { BookingStatus } from '@prisma/client';

import { NotOccupantException } from 'src/exceptions/user.exception';

import { CreateBookingDTO } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkParkingSpaceAvailability(
    claimantPublicId: string,
    parkingSpacePublicId: string,
    from: Date,
    to: Date,
  ) {
    const bookingsCount = await this.prismaService.booking.count({
      where: {
        OR: [
          // must not be able booking if there is already an approved booking for the same period
          {
            booked_from: {
              lte: from,
            },
            booked_to: {
              gte: from,
            },
            status: BookingStatus.APPROVED,
          },
          {
            booked_from: {
              lte: to,
            },
            booked_to: {
              gte: to,
            },
            status: BookingStatus.APPROVED,
          },
          // must not be able booking if there is already a pending booking for the same period by same claimant
          {
            booked_from: {
              lte: from,
            },
            booked_to: {
              gte: from,
            },
            status: BookingStatus.PENDING,
            claimant_id: claimantPublicId,
          },
          {
            booked_from: {
              lte: to,
            },
            booked_to: {
              gte: to,
            },
            status: BookingStatus.PENDING,
            claimant_id: claimantPublicId,
          },
        ],
        parking_space_id: parkingSpacePublicId,
      },
    });

    const parkingSpace = await this.prismaService.parkingSpace.findUnique({
      where: {
        public_id: parkingSpacePublicId,
      },
      include: {
        apartment: {
          include: {
            occupant: true,
          },
        },
      },
    });

    // has no booking, has occupant and is not blocked
    return (
      bookingsCount === 0 &&
      parkingSpace?.apartment.occupant !== null &&
      !parkingSpace?.is_blocked
    );
  }

  async createBooking(claimantPublicId: string, data: CreateBookingDTO) {
    const isParkingSpaceAvailable = await this.checkParkingSpaceAvailability(
      claimantPublicId,
      data.parking_space,
      data.booked_from,
      data.booked_to,
    );

    if (isParkingSpaceAvailable) {
      return await this.prismaService.booking.create({
        data: {
          ...data,
          claimant: {
            connect: {
              public_id: claimantPublicId,
            },
          },
          parking_space: {
            connect: {
              public_id: data.parking_space,
            },
          },
        },
      });
    }
    throw new Error('parking space not available');
  }

  async getBookingsByClaimant(
    claimantPublicId: string,
    status?: BookingStatus,
  ) {
    return await this.prismaService.booking.findMany({
      where: {
        claimant_id: claimantPublicId,
        status,
      },
      select: {
        public_id: true,
        status: true,
        booked_from: true,
        booked_to: true,
        parking_space: {
          select: {
            identifier: true,
            apartment: {
              select: {
                tower: {
                  select: {
                    building: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getBookingsByOccupant(
    occupantPublicId: string,
    status?: BookingStatus,
  ) {
    return await this.prismaService.booking.findMany({
      where: {
        parking_space: {
          apartment: {
            occupant: {
              public_id: occupantPublicId,
            },
          },
        },
        status,
      },
      select: {
        public_id: true,
        status: true,
        booked_from: true,
        booked_to: true,
        claimant: {
          select: {
            name: true,
            apartment: {
              select: {
                identifier: true,
                tower: {
                  select: {
                    identifier: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getBookingDetail(publicId: string) {
    return await this.prismaService.booking.findUnique({
      where: {
        public_id: publicId,
      },
      select: {
        public_id: true,
        status: true,
        booked_from: true,
        booked_to: true,
        parking_space: {
          select: {
            identifier: true,
            guidance: true,
            is_covered: true,
            apartment: {
              select: {
                identifier: true,
                tower: {
                  select: {
                    building: { select: { name: true } },
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
        },
        claimant_id: true,
      },
    });
  }

  async revokeBooking(publicId: string, userPublicId: string) {
    const booking = await this.getBookingDetail(publicId);
    if (booking?.claimant_id === userPublicId) {
      await this.prismaService.booking.update({
        data: {
          status: BookingStatus.REVOKED,
        },
        where: { public_id: publicId },
      });
    } else {
      throw new NotOccupantException();
    }
  }

  async approveBooking(publicId: string, userPublicId: string) {
    const booking = await this.getBookingDetail(publicId);
    if (booking?.parking_space.apartment.occupant?.public_id === userPublicId) {
      await this.prismaService.booking.update({
        data: {
          status: BookingStatus.APPROVED,
        },
        where: { public_id: publicId },
      });
    } else {
      throw new NotOccupantException();
    }
  }

  async refuseBooking(publicId: string, userPublicId: string) {
    const booking = await this.getBookingDetail(publicId);
    if (booking?.parking_space.apartment.occupant?.public_id === userPublicId) {
      await this.prismaService.booking.update({
        data: {
          status: BookingStatus.REFUSED,
        },
        where: { public_id: publicId },
      });
    } else {
      throw new NotOccupantException();
    }
  }
}
