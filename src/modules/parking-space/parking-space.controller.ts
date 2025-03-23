import {
  Controller,
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
import { ParkingSpaceDetailParamDTO } from './parking-space.dto';

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
      return await this.parkingSpaceService.getParkingSpacesByApartment(
        user.apartment_id,
      );
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
  async getParkingSpaceDetail(@Param() param: ParkingSpaceDetailParamDTO) {
    return await this.parkingSpaceService.getParkingSpaceDetail(param.publicId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/block')
  async blockParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() param: ParkingSpaceDetailParamDTO,
  ) {
    const isOwner = await this.parkingSpaceService.isParkingSpaceOwner(
      param.publicId,
      request.user.sub,
    );
    if (isOwner) {
      return await this.parkingSpaceService.blockParkingSpace(param.publicId);
    }
    throw new UnauthorizedException();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/unblock')
  async unblockParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() param: ParkingSpaceDetailParamDTO,
  ) {
    const isOwner = await this.parkingSpaceService.isParkingSpaceOwner(
      param.publicId,
      request.user.sub,
    );
    if (isOwner) {
      return await this.parkingSpaceService.unblockParkingSpace(param.publicId);
    }
    throw new UnauthorizedException();
  }
}
