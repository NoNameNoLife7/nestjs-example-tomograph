import { Module } from '@nestjs/common';
import {
  PatientService,
  ImageService,
  RecordService,
  TestService,
} from './services';
import {
  PatientController,
  ImageController,
  RecordController,
  TestController,
} from './controllers';

@Module({
  controllers: [
    PatientController,
    ImageController,
    RecordController,
    TestController,
  ],
  providers: [PatientService, ImageService, RecordService, TestService],
})
export class PatientModule {}
