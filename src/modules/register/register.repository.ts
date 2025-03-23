import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'nestjs-prisma';

import { CreateUserDTO } from './register.dto';

@Injectable()
export class RegisterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserDTO) {
    return await this.prismaService.user.create({
      data: {
        ...data,
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

  async getBuildings(where: Prisma.BuildingWhereInput) {
    return this.prismaService.building.findMany({
      where,
    });
  }

  async getTowers(where: Prisma.TowerWhereInput) {
    return this.prismaService.tower.findMany({
      where,
      select: {
        public_id: true,
        identifier: true,
      },
    });
  }

  async getApartments(where: Prisma.ApartmentWhereInput) {
    return this.prismaService.apartment.findMany({
      where,
      select: {
        public_id: true,
        identifier: true,
      },
    });
  }
}
