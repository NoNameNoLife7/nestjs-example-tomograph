import { Controller, Get, NotFoundException } from '@nestjs/common';
import { EquipmentConfigurationService } from '../services';

@Controller('equipmentConfiguration')
export class EquipmentConfigurationController {
  constructor(private readonly modelService: EquipmentConfigurationService) {}

  @Get('lastConfiguration')
  async lastEquipmentConfiguration() {
    const model = await this.modelService.lastConfiguration();
    if (!model[0]) throw new NotFoundException();
    return model[0];
  }
}
