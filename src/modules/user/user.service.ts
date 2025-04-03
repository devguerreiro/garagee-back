import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserForAuth(publicId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        public_id: publicId,
      },
      select: {
        public_id: true,
        password: true,
      },
    });
  }

  async getUserWithBuilding(publicId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        public_id: publicId,
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
    return await this.prismaService.user.findUnique({
      where: {
        public_id: publicId,
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

  async userExists(publicId: string) {
    return (
      (await this.prismaService.user.count({
        where: {
          public_id: publicId,
          is_active: true,
        },
      })) > 0
    );
  }
}
