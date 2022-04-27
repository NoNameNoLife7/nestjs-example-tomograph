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

type CreateData = CreateTestDto;
type UpdateData = UpdateTestDto;

@Controller('tests')
export class TestController {
  constructor(private readonly modelService: TestService) {}

  private async getInstanceOr404(id: number): Promise<TestModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<TestModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<TestModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(@Body() createTestDto: CreateData): Promise<TestModel | Error> {
    const testModel: TestModel = await this.modelService.create(createTestDto);
    if (!testModel) {
      throw new BadRequestException('Invalid test!');
    }
    return this.modelService.create(createTestDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestDto: UpdateData,
  ): Promise<TestModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateTestDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<TestModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
