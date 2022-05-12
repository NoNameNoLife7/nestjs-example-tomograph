import { Module } from '@nestjs/common';
import {
  EquipmentConfigurationService,
  FanService,
  SoftwareConfigurationService,
} from './services';
import { EquipmentConfigurationController, FanController } from './controllers';

@Module({
  controllers: [FanController, EquipmentConfigurationController],
  providers: [
    SoftwareConfigurationService,
    FanService,
    EquipmentConfigurationService,
  ],
  exports: [SoftwareConfigurationService, EquipmentConfigurationService],
})
export class ConfigurationModule {}
