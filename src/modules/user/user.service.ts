import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByUsername(username: string) {
    return await this.userRepository.getByUsername(username);
  }

  async getByPublicId(publicId: string) {
    return await this.userRepository.getByPublicId(publicId);
  }
}
