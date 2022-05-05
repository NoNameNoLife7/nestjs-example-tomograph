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
import { LogService } from '../services';
import { CreateLogDto, UpdateLogDto } from '../dto';
import { log as LogModel } from '@prisma/client';

type CreateData = CreateLogDto;
type UpdateData = UpdateLogDto;

@Controller('log')
export class LogController {
  constructor(private readonly modelService: LogService) {}

  private async getInstanceOr404(id: number): Promise<LogModel> {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<LogModel | null> {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(): Promise<LogModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createLogDto: CreateData): Promise<LogModel> {
    const logModel: LogModel = await this.modelService.create(createLogDto);
    if (!logModel) {
      throw new BadRequestException('Invalid log!');
    }
    return this.modelService.create(createLogDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLogDto: UpdateData,
  ): Promise<LogModel> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateLogDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<LogModel> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
