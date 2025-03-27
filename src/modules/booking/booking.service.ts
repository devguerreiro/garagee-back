import { Injectable } from '@nestjs/common';

import { BookingStatus } from '@prisma/client';

import { BookingRepository } from './booking.repository';
import { CreateBookingDTO } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async checkParkingSpaceAvailability(
    claimantPublicId: string,
    from: Date,
    to: Date,
  ) {
    const count = await this.bookingRepository.count({
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
    });
    return count === 0;
  }

  async createBooking(claimantPublicId: string, data: CreateBookingDTO) {
    const isParkingSpaceAvailable = await this.checkParkingSpaceAvailability(
      claimantPublicId,
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

  async getBookingsByClaimant(
    claimantPublicId: string,
    status?: BookingStatus,
  ) {
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

  async getBookingsByParkingSpace(parkingSpacePublicId: string) {
    return await this.bookingRepository.getBookings(
      {
        parking_space_id: parkingSpacePublicId,
        status: BookingStatus.APPROVED,
        booked_from: {
          gte: new Date(),
        },
      },
      {
        booked_from: true,
        booked_to: true,
      },
    );
  }
}
