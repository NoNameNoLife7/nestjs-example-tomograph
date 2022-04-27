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
import { SoftwareConfigurationService } from '../../patient/services';
import {
  CreateSoftwareConfigurationDto,
  UpdateSoftwareConfigurationDto,
} from '../../patient/dto';
import { softwareConfiguration as SoftwareConfigurationModel } from '@prisma/client';

type CreateData = CreateSoftwareConfigurationDto;
type UpdateData = UpdateSoftwareConfigurationDto;

@Controller('softwareConfigurations')
export class SoftwareConfigurationController {
  constructor(private readonly modelService: SoftwareConfigurationService) {}

  private async getInstanceOr404(
    id: number,
  ): Promise<SoftwareConfigurationModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<SoftwareConfigurationModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<SoftwareConfigurationModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(
    @Body() createSoftwareConfigurationDto: CreateData,
  ): Promise<SoftwareConfigurationModel | Error> {
    const softwareConfigurationModel: SoftwareConfigurationModel =
      await this.modelService.create(createSoftwareConfigurationDto);
    if (!softwareConfigurationModel) {
      throw new BadRequestException('Invalid softwareConfiguration!');
    }
    return this.modelService.create(createSoftwareConfigurationDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSoftwareConfigurationDto: UpdateData,
  ): Promise<SoftwareConfigurationModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateSoftwareConfigurationDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<SoftwareConfigurationModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
