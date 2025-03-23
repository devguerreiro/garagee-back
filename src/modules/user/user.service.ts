import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByUsername(username: string) {
    return await this.userRepository.getUser({
      username,
      is_active: true,
    });
  }

  async getByPublicId(publicId: string) {
    return await this.userRepository.getUser({
      public_id: publicId,
      is_active: true,
    });
  }
}
