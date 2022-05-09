import { Module } from '@nestjs/common';
import { WebSocketServer } from './websocket.server';

@Module({
  providers: [WebSocketServer],
})
export class WebSockeMo {}
