import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedRequest } from 'src/types';

import { AuthGuard } from 'src/modules/auth/auth.guard';

import { BookingService } from './booking.service';
import { BookingDetailParamDTO, BookingsQueryDTO } from './booking.dto';
import { BookingStatus } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('my')
  async getMyBookings(
    @Req() request: AuthenticatedRequest,
    @Query() query: BookingsQueryDTO,
  ) {
    return await this.bookingService.getMyBookings(
      request.user.sub,
      query.status === undefined
        ? query.status
        : (BookingStatus[query.status.toUpperCase()] as BookingStatus),
    );
  }

  @Get(':publicId')
  async getBookingDetail(@Param() param: BookingDetailParamDTO) {
    return await this.bookingService.getBookingDetail(param.publicId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/revoke')
  async revokeBooking(@Param() param: BookingDetailParamDTO) {
    await this.bookingService.revokeBooking(param.publicId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/approve')
  async approveBooking(@Param() param: BookingDetailParamDTO) {
    await this.bookingService.approveBooking(param.publicId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/refuse')
  async refuseBooking(@Param() param: BookingDetailParamDTO) {
    await this.bookingService.refuseBooking(param.publicId);
  }
}
