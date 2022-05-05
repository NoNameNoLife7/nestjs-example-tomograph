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
import { TestService } from '../services';
import { CreateTestDto, UpdateTestDto } from '../dto';
import { test as TestModel } from '@prisma/client';
import { PaginationDto } from 'src/common/utils/utils';

@Controller('test')
export class TestController {
  constructor(private readonly modelService: TestService) {}

  private async getInstanceOr404(id: number) {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  list(@Body() params: PaginationDto) {
    return this.modelService.list(params);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!+id) throw new NotFoundException();
    return this.getInstanceOr404(+id);
  }

  @Post()
  async create(@Body() createTestDto: CreateTestDto) {
    const testModel: TestModel = await this.modelService.create(createTestDto);
    if (!testModel) throw new BadRequestException('Invalid test!');
    return testModel;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateTestDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
