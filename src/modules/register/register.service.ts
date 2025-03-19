import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from './register.dto';
import { RegisterRepository } from './register.repository';

const saltOrRounds = 1;

@Injectable()
export class RegisterService {
  constructor(private readonly registerRepository: RegisterRepository) {}

  async createUser(data: CreateUserDTO) {
    const hashedPassword = bcrypt.hashSync(data.password, saltOrRounds);
    return await this.registerRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }
}
