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
import { BookingService } from 'src/modules/booking/booking.service';

import { ParkingSpaceService } from './parking-space.service';
import {
  ParkingSpaceBookingsQueryDTO,
  ParkingSpaceDetailParamDTO,
  ParkingSpaceDetailQueryDTO,
  ParkingSpacesQueryDTO,
} from './parking-space.dto';

@UseGuards(AuthGuard)
@Controller('parking-space')
export class ParkingSpaceController {
  constructor(
    private readonly parkingSpaceService: ParkingSpaceService,
    private readonly bookingService: BookingService,
  ) {}

  @Get()
  async getParkingSpaces(
    @Req() request: AuthenticatedRequest,
    @Query() query: ParkingSpacesQueryDTO,
  ) {
    return await this.parkingSpaceService.getParkingSpacesByBuilding(
      request.user.sub,
      query.isCovered,
    );
  }

  @Get('my')
  async getMyParkingSpace(@Req() request: AuthenticatedRequest) {
    return await this.parkingSpaceService.getMyParkingSpace(request.user.sub);
  }

  @Get(':publicId')
  async getParkingSpaceDetail(
    @Req() request: AuthenticatedRequest,
    @Param() param: ParkingSpaceDetailParamDTO,
    @Query() query: ParkingSpaceDetailQueryDTO,
  ) {
    return await this.parkingSpaceService.getParkingSpaceDetail(
      param.publicId,
      query.timezoneOffset,
      request.user.sub,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/block')
  async blockParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() param: ParkingSpaceDetailParamDTO,
  ) {
    await this.parkingSpaceService.blockParkingSpace(
      param.publicId,
      request.user.sub,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/unblock')
  async unblockParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() param: ParkingSpaceDetailParamDTO,
  ) {
    await this.parkingSpaceService.unblockParkingSpace(
      param.publicId,
      request.user.sub,
    );
  }

  @Get('/bookings/my')
  async getParkingSpaceBookings(
    @Req() request: AuthenticatedRequest,
    @Query() query: ParkingSpaceBookingsQueryDTO,
  ) {
    return await this.bookingService.getBookingsByOccupant(
      request.user.sub,
      query.status,
    );
  }
}
