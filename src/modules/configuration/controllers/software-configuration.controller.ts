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
import { SoftwareConfigurationService } from '../services';
import {
  CreateSoftwareConfigurationDto,
  UpdateSoftwareConfigurationDto,
} from '../dto';
import { softwareConfiguration as SoftwareConfigurationModel } from '@prisma/client';

@Controller('softwareConfiguration')
export class SoftwareConfigurationController {
  constructor(private readonly modelService: SoftwareConfigurationService) {}

  private async getInstanceOr404(
    id: number,
  ): Promise<SoftwareConfigurationModel> {
    const instance: SoftwareConfigurationModel | null =
      await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<SoftwareConfigurationModel> {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(): Promise<SoftwareConfigurationModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(
    @Body() createSoftwareConfigurationDto: CreateSoftwareConfigurationDto,
  ): Promise<SoftwareConfigurationModel> {
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
  ): Promise<SoftwareConfigurationModel> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateSoftwareConfigurationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<SoftwareConfigurationModel> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
