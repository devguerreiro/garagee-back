import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(where: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.findUnique({
      where,
      select: {
        public_id: true,
        password: true,
        apartment: {
          select: {
            tower: {
              select: {
                building_id: true,
              },
            },
          },
        },
      },
    });
  }
}
