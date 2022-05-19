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
  Query,
} from '@nestjs/common';
import { SoftwareConfigurationService } from '../services';
import {
  CreateSoftwareConfigurationDto,
  SoftwareConfigurationPaginationDto,
  UpdateSoftwareConfigurationDto,
} from '../dto';
import { softwareConfiguration as SoftwareConfigurationModel } from '@prisma/client';

@Controller('softwareConfiguration')
export class SoftwareConfigurationController {
  constructor(private readonly modelService: SoftwareConfigurationService) {}

  private async getInstanceOr404(id: number) {
    const instance: SoftwareConfigurationModel | null =
      await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(@Query() params: SoftwareConfigurationPaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(
    @Body() createSoftwareConfigurationDto: CreateSoftwareConfigurationDto,
  ) {
    const softwareConfigurationModel: SoftwareConfigurationModel =
      await this.modelService.create(createSoftwareConfigurationDto);
    if (!softwareConfigurationModel)
      throw new BadRequestException('Invalid softwareConfiguration!');
    return this.modelService.create(createSoftwareConfigurationDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSoftwareConfigurationDto: UpdateSoftwareConfigurationDto,
  ) {
    return this.modelService.update(+id, updateSoftwareConfigurationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.modelService.delete(+id);
  }
}
