import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { RegisterService } from './register.service';
import {
  CreateUserDTO,
  GetApartmentsByTowerParamDTO,
  GetBuildingByNameQueryDTO,
  GetTowersByBuildingParamDTO,
} from './register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    await this.registerService.createUser(data);
  }

  @Get('building')
  async getBuildingsByName(@Query() query: GetBuildingByNameQueryDTO) {
    return await this.registerService.getBuildingsByName(query.name);
  }

  @Get('building/:building/tower')
  async getTowersByBuilding(@Param() param: GetTowersByBuildingParamDTO) {
    return await this.registerService.getTowersByBuilding(param.building);
  }

  @Get('tower/:tower/apartment')
  async getApartmentsByTower(@Param() param: GetApartmentsByTowerParamDTO) {
    return await this.registerService.getApartmentsByTower(param.tower);
  }
}
