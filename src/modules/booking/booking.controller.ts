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
  UseGuards,
} from '@nestjs/common';

import { BookingStatus } from '@prisma/client';

import { AuthenticatedRequest } from 'src/types';

import { AuthGuard } from 'src/modules/auth/auth.guard';
import { NotificationGateway } from 'src/modules/notification/notification.gateway';

import { BookingService } from './booking.service';
import {
  BookingDetailParamDTO,
  BookingsQueryDTO,
  CreateBookingDTO,
} from './booking.dto';

@UseGuards(AuthGuard)
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  async createBooking(
    @Req() request: AuthenticatedRequest,
    @Body() data: CreateBookingDTO,
  ) {
    try {
      const booking = await this.bookingService.createBooking(
        request.user.sub,
        data,
      );
      const occupant = booking.parking_space.apartment.occupant;
      if (occupant) {
        this.notificationGateway.notifyNewBooking(occupant.public_id);
      }
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

  @Get('pending-received-quantity')
  async getPendingReceivedQuantity(@Req() request: AuthenticatedRequest) {
    return await this.bookingService.getBookingsQuantity({
      where: {
        parking_space: {
          apartment: {
            occupant: {
              public_id: request.user.sub,
            },
          },
        },
        status: BookingStatus.PENDING,
      },
    });
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
    await this.bookingService.revokeBooking(param.publicId, request.user.sub);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/approve')
  async approveBooking(
    @Req() request: AuthenticatedRequest,
    @Param() param: BookingDetailParamDTO,
  ) {
    await this.bookingService.approveBooking(param.publicId, request.user.sub);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/refuse')
  async refuseBooking(
    @Req() request: AuthenticatedRequest,
    @Param() param: BookingDetailParamDTO,
  ) {
    await this.bookingService.refuseBooking(param.publicId, request.user.sub);
  }
}
