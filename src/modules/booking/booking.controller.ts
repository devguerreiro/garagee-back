import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';

import { AuthenticatedRequest } from 'src/types';

import { AuthGuard } from 'src/modules/auth/auth.guard';

import { BookingService } from './booking.service';
import { BookingDetailParamDTO } from './booking.dto';

@UseGuards(AuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('my')
  async getMyBookings(@Req() request: AuthenticatedRequest) {
    return await this.bookingService.getMyBookings(request.user.sub);
  }

  @Get(':publicId')
  async getBookingDetail(@Param() param: BookingDetailParamDTO) {
    return await this.bookingService.getBookingDetail(param.publicId);
  }
}
