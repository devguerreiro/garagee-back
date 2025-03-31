import { Injectable } from '@nestjs/common';

import dayjs from 'src/lib/dayjs';

import { ParkingSpaceRepository } from './parking-space.repository';

type Calendar = Record<string, Array<number>>;

@Injectable()
export class ParkingSpaceService {
  constructor(
    private readonly parkingSpaceRepository: ParkingSpaceRepository,
  ) {}

  async getParkingSpacesByBuilding(
    buildingPublicId: string,
    isCovered?: boolean,
  ) {
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
          building_id: buildingPublicId,
        },
      },
    };
    if (isCovered !== undefined) {
      where['is_covered'] = isCovered;
    }
    return await this.parkingSpaceRepository.getParkingSpaces(where);
  }

  async getParkingSpaceDetail(publicId: string, timezoneOffset: number) {
    const parkingSpace = await this.parkingSpaceRepository.getParkingSpace({
      public_id: publicId,
    });
    return {
      ...parkingSpace,
      bookings: this.getBookingsCalendar(parkingSpace.bookings, timezoneOffset),
    };
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
