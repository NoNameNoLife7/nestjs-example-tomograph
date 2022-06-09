import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WebSocketServerOptions,
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
  private Ws: Server;

  private logger: Logger = new Logger('WebsocketServer');

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }
  handleConnection(client?: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.__proto__}`);
  }
  handleDisconnect(client?: Socket) {
    this.logger.log(`Client disconnected!`);
  }

  @SubscribeMessage('connections')
  handleMessage(client: any, text: any): WsResponse<String> {
    console.log('Incoming Data:', text);
    //console.log(client);

    return { event: 'msgtToClient', data: 'Hello' };
  }

  @SubscribeMessage('closeConnection')
  closeConnections(client: Socket, text: string): WsResponse<String> {
    console.log('image', text);
    return { event: 'msgtToClient', data: 'Hello' };
  }
}
