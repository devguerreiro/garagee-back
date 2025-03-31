import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedRequest } from 'src/types';

import { AuthGuard } from 'src/modules/auth/auth.guard';

import { UserService } from 'src/modules/user/user.service';

import { ParkingSpaceService } from './parking-space.service';
import {
  ParkingSpaceDetailParamDTO,
  ParkingSpaceDetailQueryDTO,
  ParkingSpacesQueryDTO,
} from './parking-space.dto';

@UseGuards(AuthGuard)
@Controller('parking-space')
export class ParkingSpaceController {
  constructor(
    private readonly parkingSpaceService: ParkingSpaceService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getParkingSpaces(
    @Req() request: AuthenticatedRequest,
    @Query() query: ParkingSpacesQueryDTO,
  ) {
    const user = await this.userService.getByPublicId(request.user.sub);
    if (user) {
      return await this.parkingSpaceService.getParkingSpacesByBuilding(
        user.apartment.tower.building_id,
        query.isCovered,
      );
    }
    throw new UnauthorizedException();
  }

  @Get('my')
  async getMyParkingSpace(@Req() request: AuthenticatedRequest) {
    return await this.parkingSpaceService.getParkingSpaceByOccupant(
      request.user.sub,
    );
  }

  @Get(':publicId')
  async getParkingSpaceDetail(
    @Param() param: ParkingSpaceDetailParamDTO,
    @Query() query: ParkingSpaceDetailQueryDTO,
  ) {
    return await this.parkingSpaceService.getParkingSpaceDetail(
      param.publicId,
      query.timezoneOffset,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/block')
  async blockParkingSpace(
    @Req() request: AuthenticatedRequest,
    @Param() param: ParkingSpaceDetailParamDTO,
  ) {
    const isOccupant = await this.parkingSpaceService.isParkingSpaceOccupant(
      param.publicId,
      request.user.sub,
    );
    if (isOccupant) {
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
    const isOccupant = await this.parkingSpaceService.isParkingSpaceOccupant(
      param.publicId,
      request.user.sub,
    );
    if (isOccupant) {
      return await this.parkingSpaceService.unblockParkingSpace(param.publicId);
    }
    throw new UnauthorizedException();
  }
}
