import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
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
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: LogRelation,
  ): Promise<LogModel | null> {
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
    return logModel;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateLogDto: UpdateData,
  ): Promise<LogModel> {
    return this.modelService.update(+id, updateLogDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string): Promise<LogModel> {
    return this.modelService.delete(+id);
  }
}
