import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { toTitleCase } from 'src/utils';

import { CreateUserDTO } from './register.dto';

const saltOrRounds = 10;

@Injectable()
export class RegisterService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    return await this.prismaService.user.create({
      data: {
        ...data,
        name: toTitleCase(data.name),
        password: hashedPassword,
        apartment: {
          connect: {
            public_id: data.apartment,
          },
        },
      },
      omit: {
        password: true,
      },
    });
  }

  async getBuildingsByName(name: string) {
    if (name.length >= 3) {
      return await this.prismaService.building.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    }
    throw new Error('"name" should contain at least 3 characters');
  }

  async getTowersByBuilding(buildingPublicId: string) {
    return await this.prismaService.tower.findMany({
      where: {
        building_id: buildingPublicId,
      },
      select: {
        public_id: true,
        identifier: true,
      },
    });
  }

  async getApartmentsByTower(towerPublicId: string) {
    return await this.prismaService.apartment.findMany({
      where: {
        tower_id: towerPublicId,
      },
      select: {
        public_id: true,
        identifier: true,
      },
    });
  }
}
