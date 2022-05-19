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
import { TestService } from '../services';
import { CreateTestDto, TestPaginationDto, UpdateTestDto } from '../dto';
import { test as TestModel } from '@prisma/client';

@Controller('test')
export class TestController {
  constructor(private readonly modelService: TestService) {}

  private async getInstanceOr404(id: number) {
    const instance = await this.modelService.getById(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get()
  list(@Query() params: TestPaginationDto) {
    return this.modelService.list(params);
  }

  @Get(':id')
  get(@Param('id') id: string) {
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
    return this.modelService.update(+id, updateTestDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.modelService.delete(+id);
  }
}
