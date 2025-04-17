import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection() {
    console.log('Connected');
  }

  handleDisconnect() {
    console.log('Disconnected');
  }

  @SubscribeMessage('join room')
  async joinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(room);
    return room;
  }

  notifyNewBooking(room: string) {
    this.server.to(room).emit('new booking');
  }
}
