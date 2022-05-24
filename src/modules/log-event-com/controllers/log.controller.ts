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
import { LogService } from '../services';
import {
  CreateLogDto,
  LogPaginationDto,
  LogRelation,
  UpdateLogDto,
} from '../dto';
import { log as LogModel } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

type CreateData = CreateLogDto;
type UpdateData = UpdateLogDto;

@Controller('log')
export class LogController {
  constructor(private readonly modelService: LogService) {}

  private async getInstanceOr404(
    id: number,
    params?: LogRelation,
  ): Promise<LogModel> {
    const instance = await this.modelService.getById(id, params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(
    @Param('id') id: string,
    @Query() params: LogRelation,
  ): Promise<LogModel | null> {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.getInstanceOr404(+id, params);
  }

  @Get()
  list(@Query() params: LogPaginationDto): Promise<WithPagination<LogModel>> {
    return this.modelService.list(params);
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
    return this.modelService.update(+id, updateLogDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<LogModel> {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.delete(+id);
  }
}
