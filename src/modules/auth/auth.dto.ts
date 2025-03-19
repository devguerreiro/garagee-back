import { IsNotEmpty, IsString } from 'class-validator';

export interface TokenDTO {
  sub: string;
  iat: number;
  exp: number;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
