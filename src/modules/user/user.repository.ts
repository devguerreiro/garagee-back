import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getByUsername(username: string) {
    return await this.prismaService.user.findUnique({
      where: {
        username,
        is_active: true,
      },
    });
  }

  async getByPublicId(publicId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        public_id: publicId,
        is_active: true,
      },
    });
  }
}
