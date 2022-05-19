import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebsocketServer } from './websocket.server';

@Module({
  imports: [HttpModule],
  providers: [WebsocketServer],
})
export class WebsocketModule {}
