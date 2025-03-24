import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class BookingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getBookings(where: Prisma.BookingWhereInput) {
    return await this.prismaService.booking.findMany({
      where,
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

  async getBooking(where: Prisma.BookingWhereUniqueInput) {
    return await this.prismaService.booking.findUnique({
      where,
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

  async update(publicId: string, data: Prisma.BookingUpdateInput) {
    return await this.prismaService.booking.update({
      data,
      where: { public_id: publicId },
    });
  }
}
