import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EquipmentConfigurationService } from '../services';

import {
  CreateEquipmentConfigurationDto,
  UpdateEquipmentConfigurationDto,
} from '../dto';

import { equipmentConfiguration as EquipmentConfigurationModel } from '@prisma/client';

type CreateData = CreateEquipmentConfigurationDto;
type UpdateData = UpdateEquipmentConfigurationDto;

@Controller('equipmentConfigurations')
export class EquipmentConfigurationController {
  constructor(private readonly modelService: EquipmentConfigurationService) {}

  private async getInstanceOr404(
    id: number,
  ): Promise<EquipmentConfigurationModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<EquipmentConfigurationModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<EquipmentConfigurationModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(
    @Body() createEquipmentConfigurationDto: CreateData,
  ): Promise<EquipmentConfigurationModel | Error> {
    const equipmentConfigurationModel: EquipmentConfigurationModel =
      await this.modelService.create(createEquipmentConfigurationDto);
    if (!equipmentConfigurationModel) {
      throw new BadRequestException('Invalid equipmentConfiguration!');
    }
    return this.modelService.create(createEquipmentConfigurationDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEquipmentConfigurationDto: UpdateData,
  ): Promise<EquipmentConfigurationModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateEquipmentConfigurationDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<EquipmentConfigurationModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
