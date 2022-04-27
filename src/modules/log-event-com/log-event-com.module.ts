import { Module } from '@nestjs/common';
import { LogController } from './controllers';
import { EventService, LogService } from './services';

@Module({
  controllers: [LogController, EventService],
  providers: [LogService, EventService],
})
export class PatientModule {}
