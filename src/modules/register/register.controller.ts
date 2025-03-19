import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { RegisterService } from './register.service';
import { CreateUserDTO, GetBuildingByNameQueryDTO } from './register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    return await this.registerService.createUser(data);
  }

  @Get('/buildings')
  async getBuildingsByName(@Query() query: GetBuildingByNameQueryDTO) {
    return await this.registerService.getBuildingsByName(query.name);
  }
}
