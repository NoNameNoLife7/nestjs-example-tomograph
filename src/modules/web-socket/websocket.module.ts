import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebsocketServer } from './websocket.server';
import { WebsocketService } from './services/websocket.service';
import { WebsocketController } from './controllers';

@Module({
  imports: [HttpModule],
  providers: [WebsocketServer, WebsocketService],
  controllers: [WebsocketController],
})
export class WebsocketModule {}
