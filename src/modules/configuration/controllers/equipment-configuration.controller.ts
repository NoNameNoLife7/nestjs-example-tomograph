import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EquipmentConfigurationService } from '../services';
import {
  equipmentConfiguration as EquipmentConfigurationModel,
  equipmentConfiguration,
} from '@prisma/client';
import {
  CreateEquipmentConfigurationDto,
  EquipmentConfigurationPaginationDto,
  UpdateEquipmentConfigurationDto,
} from '../dto';

@Controller('equipmentConfiguration')
export class EquipmentConfigurationController {
  constructor(private readonly modelService: EquipmentConfigurationService) {}

  @Get('lastConfiguration')
  async lastEquipmentConfiguration() {
    const model: equipmentConfiguration[] =
      await this.modelService.lastConfiguration();
    if (!model[0]) {
      model[0] = await this.create({
        adjacent: false,
        direction: 'IZQ_DER',
        injectionFrequency: null,
        jump: null,
      });
    }
    return model;
  }

  private async getInstanceOr404(id: number) {
    const instance: EquipmentConfigurationModel | null =
      await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  list(@Query() params: EquipmentConfigurationPaginationDto) {
    return this.modelService.list(params);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.getInstanceOr404(+id);
  }

  @Post()
  async create(
    @Body() createEquipmentConfigurationDto: CreateEquipmentConfigurationDto,
  ) {
    const equipmentConfigurationModel: EquipmentConfigurationModel =
      await this.modelService.create(createEquipmentConfigurationDto);
    if (!equipmentConfigurationModel)
      throw new BadRequestException('Invalid Equipment Configuration!');
    return this.modelService.create(createEquipmentConfigurationDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEquipmentConfigurationDto: UpdateEquipmentConfigurationDto,
  ) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.update(+id, updateEquipmentConfigurationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.delete(+id);
  }
}
