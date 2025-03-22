import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedRequest } from 'src/types';

import { AuthGuard } from 'src/modules/auth/auth.guard';

import { UserService } from 'src/modules/user/user.service';

import { ParkingSpaceService } from './parking-space.service';
import {
  ParkingSpaceDetailParamsDTO,
  ParkingSpaceUpdateDTO,
} from './parking-space.dto';

@UseGuards(AuthGuard)
@Controller('parking-space')
export class ParkingSpaceController {
  constructor(
    private readonly parkingSpaceService: ParkingSpaceService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getParkingSpaces(@Req() request: AuthenticatedRequest) {
    const user = await this.userService.getByPublicId(request.user.sub);
    if (user) {
      return await this.parkingSpaceService.getParkingSpaces(user.building_id);
    }
    throw new UnauthorizedException();
  }

  @Get('my')
  async getMyParkingSpaces(@Req() request: AuthenticatedRequest) {
    return await this.parkingSpaceService.getParkingSpacesByOwner(
      request.user.sub,
    );
  }

  @Get(':publicId')
  async getParkingSpaceDetail(@Param() params: ParkingSpaceDetailParamsDTO) {
    return await this.parkingSpaceService.getParkingSpaceDetail(
      params.publicId,
    );
  }

  @Patch(':publicId')
  async updateParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() params: ParkingSpaceDetailParamsDTO,
    @Body() data: ParkingSpaceUpdateDTO,
  ) {
    const isOwner = await this.parkingSpaceService.isParkingSpaceOwner(
      params.publicId,
      request.user.sub,
    );
    if (isOwner) {
      return await this.parkingSpaceService.updateParkingSpace(
        params.publicId,
        data,
      );
    }
    throw new UnauthorizedException();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/block')
  async blockParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() params: ParkingSpaceDetailParamsDTO,
  ) {
    const isOwner = await this.parkingSpaceService.isParkingSpaceOwner(
      params.publicId,
      request.user.sub,
    );
    if (isOwner) {
      return await this.parkingSpaceService.blockParkingSpace(params.publicId);
    }
    throw new UnauthorizedException();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/unblock')
  async unblockParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() params: ParkingSpaceDetailParamsDTO,
  ) {
    const isOwner = await this.parkingSpaceService.isParkingSpaceOwner(
      params.publicId,
      request.user.sub,
    );
    if (isOwner) {
      return await this.parkingSpaceService.unblockParkingSpace(
        params.publicId,
      );
    }
    throw new UnauthorizedException();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':publicId')
  async deleteParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() params: ParkingSpaceDetailParamsDTO,
  ) {
    const isOwner = await this.parkingSpaceService.isParkingSpaceOwner(
      params.publicId,
      request.user.sub,
    );
    if (isOwner) {
      return await this.parkingSpaceService.deleteParkingSpace(params.publicId);
    }
    throw new UnauthorizedException();
  }
}
