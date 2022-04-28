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
import { CommunicationService } from '../services';
import { CreateCommunicationDto, UpdateCommunicationDto } from '../dto';
import { comunication as CommunicationModel } from '@prisma/client';

type CreateData = CreateCommunicationDto;
type UpdateData = UpdateCommunicationDto;

@Controller('communications')
export class CommunicationController {
  constructor(private readonly modelService: CommunicationService) {}

  private async getInstanceOr404(id: number): Promise<CommunicationModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<CommunicationModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<CommunicationModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(
    @Body() createCommunicationDto: CreateData,
  ): Promise<CommunicationModel | Error> {
    const communicationModel: CommunicationModel =
      await this.modelService.create(createCommunicationDto);
    if (!communicationModel) {
      throw new BadRequestException('Invalid communication!');
    }
    return this.modelService.create(createCommunicationDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommunicationDto: UpdateData,
  ): Promise<CommunicationModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateCommunicationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CommunicationModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
