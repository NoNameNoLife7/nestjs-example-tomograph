import { Module } from '@nestjs/common';
import {
  EquipmentConfigurationService,
  FanService,
  SoftwareConfigurationService,
} from './services';
import { EquipmentConfigurationController, FanController } from './controllers';
import { SoftwareConfigurationController } from './controllers/software-configuration.controller';

@Module({
  controllers: [
    FanController,
    EquipmentConfigurationController,
    SoftwareConfigurationController,
  ],
  providers: [
    SoftwareConfigurationService,
    FanService,
    EquipmentConfigurationService,
  ],
  exports: [SoftwareConfigurationService, EquipmentConfigurationService],
})
export class ConfigurationModule {}
