import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from 'src/common/utils/websocket-exception-filter';

@WebSocketGateway()
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class WebsocketServer
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('WebsocketServer');

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected!`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected!`);
  }

  @SubscribeMessage('connections')
  handleMessage(client: Socket, text: string): WsResponse<String> {
    return { event: 'msgtToClient', data: 'Hello' };
  }

  @SubscribeMessage('closeConnection')
  closeConnections(client: Socket, text: string): WsResponse<String> {
    return { event: 'msgtToClient', data: 'Hello' };
  }
}
