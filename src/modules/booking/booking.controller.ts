import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedRequest } from 'src/types';

import { AuthGuard } from 'src/modules/auth/auth.guard';

import { BookingService } from './booking.service';
import {
  BookingDetailParamDTO,
  BookingsQueryDTO,
  CreateBookingDTO,
} from './booking.dto';

@UseGuards(AuthGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateBookingDTO,
  ) {
    try {
      return await this.bookingService.createBooking(request.user.sub, data);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @Get('my')
  async getMyBookings(
    @Req() request: AuthenticatedRequest,
    @Query() query: BookingsQueryDTO,
  ) {
    return await this.bookingService.getBookingsByClaimant(
      request.user.sub,
      query.status,
    );
  }

  @Get(':publicId')
  async getBookingDetail(@Param() param: BookingDetailParamDTO) {
    return await this.bookingService.getBookingDetail(param.publicId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/revoke')
  async revokeBooking(
    @Req() request: AuthenticatedRequest,
    @Param() param: BookingDetailParamDTO,
  ) {
    const booking = await this.bookingService.getBookingDetail(param.publicId);
    if (booking?.claimant_id === request.user.sub) {
      await this.bookingService.revokeBooking(param.publicId);
    } else {
      throw new UnauthorizedException();
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/approve')
  async approveBooking(
    @Req() request: AuthenticatedRequest,
    @Param() param: BookingDetailParamDTO,
  ) {
    const booking = await this.bookingService.getBookingDetail(param.publicId);
    if (
      booking?.parking_space.apartment.occupant?.public_id === request.user.sub
    ) {
      await this.bookingService.approveBooking(param.publicId);
    } else {
      throw new UnauthorizedException();
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/refuse')
  async refuseBooking(
    @Req() request: AuthenticatedRequest,
    @Param() param: BookingDetailParamDTO,
  ) {
    const booking = await this.bookingService.getBookingDetail(param.publicId);
    if (
      booking?.parking_space.apartment.occupant?.public_id === request.user.sub
    ) {
      await this.bookingService.refuseBooking(param.publicId);
    } else {
      throw new UnauthorizedException();
    }
  }
}
