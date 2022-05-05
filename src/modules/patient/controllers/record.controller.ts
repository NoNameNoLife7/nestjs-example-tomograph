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
import { RecordService } from '../services';
import { CreateRecordDto, UpdateRecordDto } from '../dto';
import { record as RecordModel } from '@prisma/client';

@Controller('record')
export class RecordController {
  constructor(private readonly modelService: RecordService) {}

  private async getInstanceOr404(id: number): Promise<RecordModel> {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<RecordModel> {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Get()
  list(): Promise<RecordModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createRecordDto: CreateRecordDto): Promise<RecordModel> {
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
  ): Promise<RecordModel> {
    if (!+id) throw new NotFoundException();
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<RecordModel> {
    if (!+id) throw new NotFoundException();
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
