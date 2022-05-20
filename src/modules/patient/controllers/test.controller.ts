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
import { TestService } from '../services';
import { CreateTestDto, TestPaginationDto, UpdateTestDto } from '../dto';
import { PatientPosition } from '@prisma/client';

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

  @Get('positions')
  getListPosition() {
    return PatientPosition;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.getInstanceOr404(+id);
  }

  @Post()
  async create(@Body() createTestDto: CreateTestDto) {
    const testModel = await this.modelService.create(createTestDto);
    if (!testModel) throw new BadRequestException('Invalid test!');
    return testModel;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.update(+id, updateTestDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.delete(+id);
  }
}
