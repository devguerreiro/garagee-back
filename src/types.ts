import { Request } from 'express';

import { TokenDTO } from './modules/auth/auth.dto';

export type AuthenticatedRequest = {
  user: TokenDTO;
} & Request;
