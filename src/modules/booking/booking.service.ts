import { Injectable } from '@nestjs/common';

import { BookingStatus } from '@prisma/client';

import { BookingRepository } from './booking.repository';
import { CreateBookingDTO } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async checkParkingSpaceAvailability(from: Date, to: Date) {
    const count = await this.bookingRepository.count({
      OR: [
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
      ],
    });
    return count === 0;
  }

  async createBooking(claimantPublicId: string, data: CreateBookingDTO) {
    const isParkingSpaceAvailable = await this.checkParkingSpaceAvailability(
      data.booked_from,
      data.booked_to,
    );

    if (isParkingSpaceAvailable) {
      return await this.bookingRepository.createBooking({
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
      });
    }
    throw new Error('parking space not available');
  }

  async getMyBookings(claimantPublicId: string, status?: BookingStatus) {
    return await this.bookingRepository.getBookings({
      claimant_id: claimantPublicId,
      status,
    });
  }

  async getBookingDetail(publicId: string) {
    return await this.bookingRepository.getBooking({
      public_id: publicId,
    });
  }

  async revokeBooking(publicId: string) {
    return await this.bookingRepository.update(publicId, {
      status: BookingStatus.REVOKED,
    });
  }

  async approveBooking(publicId: string) {
    return await this.bookingRepository.update(publicId, {
      status: BookingStatus.APPROVED,
    });
  }

  async refuseBooking(publicId: string) {
    return await this.bookingRepository.update(publicId, {
      status: BookingStatus.REFUSED,
    });
  }
}
