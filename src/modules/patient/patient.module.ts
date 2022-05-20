import { Module } from '@nestjs/common';
import {
  ImageService,
  PathNodeService,
  PatientService,
  RecordService,
  TestService,
} from './services';
import {
  ImageController,
  PathNodeController,
  PatientController,
  RecordController,
  TestController,
} from './controllers';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [ConfigurationModule],
  controllers: [
    PatientController,
    ImageController,
    RecordController,
    TestController,
    PathNodeController,
  ],
  providers: [
    PatientService,
    ImageService,
    RecordService,
    TestService,
    PathNodeService,
  ],
})
export class PatientModule {}
