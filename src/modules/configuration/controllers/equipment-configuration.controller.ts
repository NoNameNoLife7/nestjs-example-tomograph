import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EquipmentConfigurationService } from '../services';
import { equipmentConfiguration as EquipmentConfigurationModel } from '@prisma/client';
import {
  arrayFreq,
  arraySamp,
  CreateEquipmentConfigurationDto,
  EquipmentConfigurationPaginationDto,
  EquipmentConfigurationRelation,
  UpdateEquipmentConfigurationDto,
} from '../dto';
import { IsIn } from 'class-validator';

@Controller('equipmentConfiguration')
export class EquipmentConfigurationController {
  constructor(private readonly modelService: EquipmentConfigurationService) {}

  @Get('lastConfiguration')
  async lastEquipmentConfiguration(): Promise<EquipmentConfigurationModel> {
    let model = (await this.modelService.lastConfiguration())[0];
    if (!model)
      model = await this.create({
        adjacent: false,
        direction: 'IZQ_DER',
      });
    return model;
  }

  @Get('injectionFrequency')
  getInjectionFrequency() {
    return arrayFreq;
  }

  @Get('samplingRate')
  getSamplingRate() {
    return arraySamp;
  }

  private async getInstanceOr404(
    id: number,
    params?: EquipmentConfigurationRelation,
  ) {
    const instance = await this.modelService.getById(id, params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  list(@Query() params: EquipmentConfigurationPaginationDto) {
    return this.modelService.list(params);
  }

  @Get(':id')
  get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: EquipmentConfigurationRelation,
  ) {
    return this.getInstanceOr404(+id, params);
  }

  @Post()
  async create(
    @Body() createEquipmentConfigurationDto: CreateEquipmentConfigurationDto,
  ) {
    const { adjacent, jump } = createEquipmentConfigurationDto;
    if (adjacent === false && jump && (jump < 1 || jump > 14))
      throw new BadRequestException(
        'Error: adjacent is set to false, so jump field is required and it must be between [1-14]!',
      );

    const equipmentConfigurationModel: EquipmentConfigurationModel =
      await this.modelService.create(createEquipmentConfigurationDto);
    if (!equipmentConfigurationModel)
      throw new BadRequestException('Invalid Equipment Configuration!');
    return this.modelService.create(createEquipmentConfigurationDto);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateEquipmentConfigurationDto: UpdateEquipmentConfigurationDto,
  ) {
    return this.modelService.update(+id, updateEquipmentConfigurationDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string) {
    return this.modelService.delete(+id);
  }
}
