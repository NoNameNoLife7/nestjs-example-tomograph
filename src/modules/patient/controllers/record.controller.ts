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
import { RecordService } from '../services';
import {
  CreateRecordDto,
  ImagePaginationDto,
  RecordRelation,
  UpdateRecordDto,
} from '../dto';
import { record as RecordModel } from '@prisma/client';

@Controller('record')
export class RecordController {
  constructor(private readonly modelService: RecordService) {}

  private async getInstanceOr404(id: number, params?: RecordRelation) {
    const instance = await this.modelService.getById(id, params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: RecordRelation,
  ) {
    return this.getInstanceOr404(+id), params;
  }

  @Get()
  list(@Query() params: ImagePaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(@Body() createRecordDto: CreateRecordDto) {
    const recordModel: RecordModel = await this.modelService.create(
      createRecordDto,
    );
    if (!recordModel) throw new BadRequestException('Invalid record!');
    return recordModel;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    return this.modelService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string) {
    return this.modelService.delete(+id);
  }
}
