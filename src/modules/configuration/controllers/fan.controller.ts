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
import { FanService } from '../services';
import { CreateFanDto, FanPaginationDto, UpdateFanDto } from '../dto';
import { fan as FanModel } from '@prisma/client';
import { FanRelation } from '../dto/fan.dto';

@Controller('fan')
export class FanController {
  constructor(private readonly modelService: FanService) {}

  private async getInstanceOr404(id: number, params?: FanRelation) {
    const instance: FanModel | null = await this.modelService.getById(
      id,
      params,
    );
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string, @Query() params: FanRelation) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.getInstanceOr404(+id, params);
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
  async update(@Param('id') id: string, @Body() updateDto: UpdateFanDto) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.update(+id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.delete(+id);
  }
}
