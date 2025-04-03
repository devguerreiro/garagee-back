import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.getUserForAuth(username);
    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (passwordMatches) {
        const payload = {
          sub: user.public_id,
        };
        return { access_token: await this.jwtService.signAsync(payload) };
      }
    }
    throw new UnauthorizedException();
  }
}
