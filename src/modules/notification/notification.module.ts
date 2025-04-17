import { Module } from '@nestjs/common';

import { NotificationGateway } from './notification.gateway';

@Module({
  exports: [NotificationGateway],
  providers: [NotificationGateway],
})
export class NotificationModule {}
