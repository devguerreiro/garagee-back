import { Injectable } from '@nestjs/common';

import { BookingStatus } from '@prisma/client';

import { BookingRepository } from './booking.repository';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

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
