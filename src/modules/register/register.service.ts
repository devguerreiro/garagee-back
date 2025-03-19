import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from './register.dto';
import { RegisterRepository } from './register.repository';

const saltOrRounds = 10;

@Injectable()
export class RegisterService {
  constructor(private readonly registerRepository: RegisterRepository) {}

  async createUser(data: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    return await this.registerRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  async getBuildingsByName(name: string) {
    if (name.length >= 3) {
      return await this.registerRepository.getBuildingsByName(name);
    }
    throw new Error('"name" should contain at least 3 characters');
  }
}
