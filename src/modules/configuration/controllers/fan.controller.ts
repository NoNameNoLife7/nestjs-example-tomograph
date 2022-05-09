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
import { FanService } from '../services';
import { CreateFanDto, FanPaginationDto, UpdateFanDto } from '../dto';
import { fan as FanModel } from '@prisma/client';

@Controller('fan')
export class FanController {
  constructor(private readonly modelService: FanService) {}

  private async getInstanceOr404(id: number) {
    const instance: FanModel | null = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(@Query() params: FanPaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(@Body() createFanDto: CreateFanDto) {
    const fanModel: FanModel = await this.modelService.create(createFanDto);
    if (!fanModel) throw new BadRequestException('Invalid fan!');
    return this.modelService.create(createFanDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFanDto: UpdateFanDto) {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateFanDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
