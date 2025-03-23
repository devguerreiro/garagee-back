import { Injectable } from '@nestjs/common';

import { BookingRepository } from './booking.repository';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async getMyBookings(claimantPublicId: string) {
    return await this.bookingRepository.getBookings({
      claimant_id: claimantPublicId,
    });
  }

  async getBookingDetail(publicId: string) {
    return await this.bookingRepository.getBooking({
      public_id: publicId,
    });
  }
}
