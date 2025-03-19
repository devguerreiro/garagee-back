import { Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';

import { CreateUserDTO } from './register.dto';

@Injectable()
export class RegisterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserDTO) {
    return await this.prismaService.user.create({
      data: {
        name: data.name,
        apartment: data.apartment,
        building: {
          connect: {
            public_id: data.building,
          },
        },
        username: data.username,
        password: data.password,
      },
    });
  }

  async getBuildingsByName(name: string) {
    return this.prismaService.building.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }
}
