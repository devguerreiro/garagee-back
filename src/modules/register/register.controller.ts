import { Body, Controller, Post } from '@nestjs/common';

import { RegisterService } from './register.service';
import { CreateUserDTO } from './register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    return await this.registerService.createUser(data);
  }
}
