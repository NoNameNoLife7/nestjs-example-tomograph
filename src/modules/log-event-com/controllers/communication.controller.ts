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
} from '@nestjs/common';
import { CommunicationService } from '../services';
import { CreateCommunicationDto, UpdateCommunicationDto } from '../dto';
import { communication as CommunicationModel } from '@prisma/client';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly modelService: CommunicationService) {}

  private async getInstanceOr404(id: number) {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.getInstanceOr404(+id);
  }

  @Get()
  list() {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createCommunicationDto: CreateCommunicationDto) {
    const communicationModel: CommunicationModel =
      await this.modelService.create(createCommunicationDto);
    if (!communicationModel)
      throw new BadRequestException('Invalid communication!');

    return this.modelService.create(createCommunicationDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommunicationDto: UpdateCommunicationDto,
  ) {
    return this.modelService.update(+id, updateCommunicationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.delete(+id);
  }
}
