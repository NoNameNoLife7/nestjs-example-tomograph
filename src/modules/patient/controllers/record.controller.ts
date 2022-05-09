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
import { RecordService } from '../services';
import { CreateRecordDto, ImagePaginationDto, UpdateRecordDto } from '../dto';
import { record as RecordModel } from '@prisma/client';

@Controller('record')
export class RecordController {
  constructor(private readonly modelService: RecordService) {}

  private async getInstanceOr404(id: number) {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
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
    return this.modelService.create(createRecordDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    if (!+id) throw new NotFoundException();
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new NotFoundException();
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
