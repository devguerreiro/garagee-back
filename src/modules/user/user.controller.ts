import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/modules/auth/auth.guard';

import { AuthenticatedRequest } from 'src/types';

import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() request: AuthenticatedRequest) {
    return await this.userService.getUserProfile(request.user.sub);
  }
}
