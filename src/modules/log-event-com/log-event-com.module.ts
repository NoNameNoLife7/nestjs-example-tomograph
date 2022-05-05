import { Module } from '@nestjs/common';
import { EventController, LogController } from './controllers';
import { CommunicationController } from './controllers/communication.controller';
import { CommunicationService, EventService, LogService } from './services';

@Module({
  controllers: [LogController, EventController, CommunicationController],
  providers: [LogService, EventService, CommunicationService],
})
export class LogEventComModule {}
