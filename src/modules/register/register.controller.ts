import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { RegisterService } from './register.service';
import {
  CreateUserDTO,
  GetApartmentsByTowerQueryDTO,
  GetBuildingByNameQueryDTO,
  GetTowersByBuildingQueryDTO,
} from './register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    return await this.registerService.createUser(data);
  }

  @Get('/building')
  async getBuildingsByName(@Query() query: GetBuildingByNameQueryDTO) {
    return await this.registerService.getBuildingsByName(query.name);
  }

  @Get('/building/:building/tower')
  async getTowersByBuilding(@Query() query: GetTowersByBuildingQueryDTO) {
    return await this.registerService.getTowersByBuilding(query.building);
  }

  @Get('tower/:tower/apartment')
  async getApartmentsByTower(@Query() query: GetApartmentsByTowerQueryDTO) {
    return await this.registerService.getApartmentsByTower(query.tower);
  }
}
