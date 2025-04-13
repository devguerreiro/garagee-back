import { ForbiddenException, Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

import dayjs from 'src/lib/dayjs';

import { UserService } from 'src/modules/user/user.service';

import { NotOccupantException } from 'src/exceptions/user.exception';

type Calendar = Record<string, Array<number>>;

@Injectable()
export class ParkingSpaceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getParkingSpacesByBuilding(userPublicId: string, isCovered?: boolean) {
    const user = await this.userService.getUserWithBuilding(userPublicId);
    if (user) {
      const where: {
        apartment: {
          tower: {
            building_id: string;
          };
        };
        is_covered?: boolean;
      } = {
        apartment: {
          tower: {
            building_id: user.apartment.tower.building_id,
          },
        },
      };
      if (isCovered !== undefined) {
        where['is_covered'] = isCovered;
      }
      return await this.prismaService.parkingSpace.findMany({
        where: {
          ...where,
          apartment: {
            NOT: {
              OR: [
                {
                  occupant: null,
                },
                {
                  occupant: {
                    public_id: userPublicId,
                  },
                },
              ],
            },
          },
          is_blocked: false,
        },
        select: {
          public_id: true,
          identifier: true,
          apartment: {
            select: {
              identifier: true,
              tower: {
                select: {
                  identifier: true,
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
    throw new ForbiddenException('user not found');
  }

  async getParkingSpaceDetail(
    publicId: string,
    timezoneOffset: number,
    userPublicId: string,
  ) {
    const parkingSpace =
      await this.prismaService.parkingSpace.findUniqueOrThrow({
        where: {
          public_id: publicId,
          apartment: {
            NOT: {
              OR: [
                {
                  occupant: null,
                },
                {
                  occupant: {
                    public_id: userPublicId,
                  },
                },
              ],
            },
          },
          is_blocked: false,
        },
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
                  identifier: true,
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
          bookings: {
            where: {
              status: BookingStatus.APPROVED,
              OR: [
                {
                  booked_from: {
                    gte: dayjs().toDate(),
                  },
                },
                {
                  booked_to: {
                    gte: dayjs().toDate(),
                  },
                },
              ],
            },
            select: {
              booked_from: true,
              booked_to: true,
            },
          },
        },
      });
    return {
      ...parkingSpace,
      bookings: this.getBookingsCalendar(parkingSpace.bookings, timezoneOffset),
    };
  }

  async blockParkingSpace(publicId: string, userPublicId: string) {
    const isOccupant = await this.isParkingSpaceOccupant(
      publicId,
      userPublicId,
    );
    if (isOccupant) {
      await this.prismaService.parkingSpace.update({
        data: {
          is_blocked: true,
        },
        where: {
          public_id: publicId,
        },
      });
    } else {
      throw new NotOccupantException();
    }
  }

  async unblockParkingSpace(publicId: string, userPublicId: string) {
    const isOccupant = await this.isParkingSpaceOccupant(
      publicId,
      userPublicId,
    );
    if (isOccupant) {
      await this.prismaService.parkingSpace.update({
        data: {
          is_blocked: false,
        },
        where: {
          public_id: publicId,
        },
      });
    } else {
      throw new NotOccupantException();
    }
  }

  async isParkingSpaceOccupant(publicId: string, userPublicId: string) {
    const parkingSpace =
      await this.prismaService.parkingSpace.findUniqueOrThrow({
        where: {
          public_id: publicId,
        },
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
          bookings: {
            where: {
              status: BookingStatus.APPROVED,
              OR: [
                {
                  booked_from: {
                    gte: dayjs().toDate(),
                  },
                },
                {
                  booked_to: {
                    gte: dayjs().toDate(),
                  },
                },
              ],
            },
            select: {
              booked_from: true,
              booked_to: true,
            },
          },
        },
      });
    const occupant = parkingSpace.apartment.occupant;
    return occupant && occupant.public_id === userPublicId;
  }

  async getMyParkingSpace(occupantPublicId: string) {
    return await this.prismaService.parkingSpace.findFirstOrThrow({
      where: {
        apartment: {
          occupant: {
            public_id: occupantPublicId,
          },
        },
      },
      select: {
        public_id: true,
        identifier: true,
        guidance: true,
        is_covered: true,
        is_blocked: true,
      },
    });
  }

  private getBookingCalendar(
    booking: {
      booked_from: Date;
      booked_to: Date;
    },
    timezoneOffset: number,
  ): Calendar {
    const calendar: Record<string, Array<number>> = {};

    const bookedTo = dayjs(booking.booked_to).utcOffset(timezoneOffset);

    let bookedDate = dayjs(booking.booked_from).utcOffset(timezoneOffset);

    while (
      bookedDate.isBefore(bookedTo, 'hour') ||
      bookedDate.isSame(bookedTo, 'hour')
    ) {
      const date = bookedDate.format('L');
      const hour = bookedDate.hour();
      if (calendar[date] === undefined) {
        calendar[date] = [hour];
      } else {
        calendar[date].push(hour);
      }
      bookedDate = bookedDate.add(1, 'hour');
    }

    return calendar;
  }

  private getBookingsCalendar(
    bookings: Array<{ booked_from: Date; booked_to: Date }>,
    timezoneOffset: number,
  ): Calendar {
    return bookings.reduce(
      (calendar, booking) => {
        const bookingCalendar = this.getBookingCalendar(
          booking,
          timezoneOffset,
        );
        return { ...calendar, ...bookingCalendar };
      },
      {} as Record<string, Array<number>>,
    );
  }
}
