import { Controller, Get, NotFoundException } from '@nestjs/common';
import { EquipmentConfigurationService } from '../services';

/*
import {
  CreateEquipmentConfigurationDto,
  UpdateEquipmentConfigurationDto,
} from '../dto';
*/

@Controller('equipmentConfiguration')
export class EquipmentConfigurationController {
  constructor(private readonly modelService: EquipmentConfigurationService) {}

  @Get('lastConfiguration')
  async lastEquipmentConfiguration() {
    const model = await this.modelService.lastConfiguration();
    if (model[0]) return model[0];
    else throw new NotFoundException();
  }

  // private async getInstanceOr404(
  //   id: number,
  // ): Promise<EquipmentConfigurationModel> {
  //   const instance = await this.modelService.getById(id);
  //   if (!instance) throw new NotFoundException();
  //   return instance;
  // }

  // @Get(':id')
  // get(@Param('id') id: string): Promise<EquipmentConfigurationModel> {
  //   if (!+id) throw new NotFoundException();
  //   return this.getInstanceOr404(+id);
  // }

  // @Get()
  // list(): Promise<EquipmentConfigurationModel[]> { //fix in case of use in the future
  //   return this.modelService.list();
  // }

  // @Post()
  // create(
  //   @Body() createEquipmentConfigurationDto: CreateEquipmentConfigurationDto,
  // ): Promise<EquipmentConfigurationModel> {
  //   return this.modelService.create(createEquipmentConfigurationDto);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateEquipmentConfigurationDto: UpdateEquipmentConfigurationDto,
  // ): Promise<EquipmentConfigurationModel> {
  //   await this.getInstanceOr404(+id);
  //   return this.modelService.update(+id, updateEquipmentConfigurationDto);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string): Promise<EquipmentConfigurationModel> {
  //   await this.getInstanceOr404(+id);
  //   return this.modelService.delete(+id);
  // }
}
