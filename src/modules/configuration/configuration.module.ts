import { Module } from '@nestjs/common';
import {
  EquipmentConfigurationService,
  FanService,
  SoftwareConfigurationService,
} from './services';
import {
  EquipmentConfigurationController,
  FanController,
  //SoftwareConfigurationController,
} from './controllers';

@Module({
  controllers: [
    //SoftwareConfigurationController,
    FanController,
    EquipmentConfigurationController,
  ],
  providers: [
    SoftwareConfigurationService,
    FanService,
    EquipmentConfigurationService,
  ],
  exports: [SoftwareConfigurationService, EquipmentConfigurationService],
})
export class ConfigurationModule {}
