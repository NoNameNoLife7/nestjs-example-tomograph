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
import { FanService } from '../services';
import { CreateFanDto, UpdateFanDto } from '../dto';
import { fan as FanModel } from '@prisma/client';

type CreateData = CreateFanDto;
type UpdateData = UpdateFanDto;

@Controller('fans')
export class FanController {
  constructor(private readonly modelService: FanService) {}

  private async getInstanceOr404(id: number): Promise<FanModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<FanModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<FanModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createFanDto: CreateData): Promise<FanModel | Error> {
    const fanModel: FanModel = await this.modelService.create(createFanDto);
    if (!fanModel) {
      throw new BadRequestException('Invalid fan!');
    }
    return this.modelService.create(createFanDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFanDto: UpdateData,
  ): Promise<FanModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateFanDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<FanModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
