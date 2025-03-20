import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { AuthGuard } from 'src/modules/auth/auth.guard';
import { TokenDTO } from 'src/modules/auth/auth.dto';

import { UserService } from 'src/modules/user/user.service';

import { ParkingSpaceService } from './parking-space.service';

@Controller('parking-space')
export class ParkingSpaceController {
  constructor(
    private readonly parkingSpaceService: ParkingSpaceService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getParkingSpaces(@Req() request: Request & { user: TokenDTO }) {
    const user = await this.userService.getByPublicId(request.user.sub);
    if (user) {
      return await this.parkingSpaceService.getParkingSpacesByBuilding(
        user.building_id,
      );
    }
    throw new UnauthorizedException();
  }
}
