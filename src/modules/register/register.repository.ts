import { Injectable } from '@nestjs/common';

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
