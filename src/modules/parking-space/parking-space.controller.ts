import {
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthenticatedRequest } from 'src/types';

import { AuthGuard } from 'src/modules/auth/auth.guard';

import { UserService } from 'src/modules/user/user.service';

import { ParkingSpaceService } from './parking-space.service';
import { ParkingSpaceDetailParamsDTO } from './parking-space.dto';

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
}
