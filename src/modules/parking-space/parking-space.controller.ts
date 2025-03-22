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

  @Get(':publicId')
  async getParkingSpaceDetail(@Param() params: ParkingSpaceDetailParamsDTO) {
    return await this.parkingSpaceService.getParkingSpaceDetail(
      params.publicId,
    );
  }

  @Patch(':publicId')
  async updateParkingSpace(
    @Param() params: ParkingSpaceDetailParamsDTO,
    @Body() data: ParkingSpaceUpdateDTO,
  ) {
    return await this.parkingSpaceService.updateParkingSpace(
      params.publicId,
      data,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/block')
  async blockParkingSpace(@Param() params: ParkingSpaceDetailParamsDTO) {
    await this.parkingSpaceService.blockParkingSpace(params.publicId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':publicId/unblock')
  async unblockParkingSpace(@Param() params: ParkingSpaceDetailParamsDTO) {
    await this.parkingSpaceService.unblockParkingSpace(params.publicId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':publicId')
  async deleteParkingSpace(@Param() params: ParkingSpaceDetailParamsDTO) {
    await this.parkingSpaceService.deleteParkingSpace(params.publicId);
  }
}
