import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserForAuth(username: string) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        username,
        is_active: true,
      },
      select: {
        public_id: true,
        password: true,
      },
    });
  }

  async getUserWithBuilding(publicId: string) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        public_id: publicId,
        is_active: true,
      },
      include: {
        apartment: {
          include: {
            tower: {
              include: {
                building: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserProfile(publicId: string) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        public_id: publicId,
        is_active: true,
      },
      select: {
        public_id: true,
        name: true,
        apartment: {
          select: {
            identifier: true,
            tower: {
              select: {
                building: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
