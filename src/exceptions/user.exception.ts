import { ForbiddenException } from '@nestjs/common';

export class NotOccupantException extends ForbiddenException {
  message: string = 'user is not the occupant';
}
