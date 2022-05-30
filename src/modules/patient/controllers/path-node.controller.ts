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
import { PathNodeService } from '../services';
import {
  CreatePathNodeDto,
  PathNodePaginationDto,
  PathNodeRelation,
  UpdatePathNodeDto,
} from '../dto';
import { pathNode as PathNodeModel } from '@prisma/client';

@Controller('pathNode')
export class PathNodeController {
  constructor(private readonly modelService: PathNodeService) {}

  private async getInstanceOr404(id: number, params?: PathNodeRelation) {
    const instance = await this.modelService.getById(id, params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: PathNodeRelation,
  ) {
    return this.getInstanceOr404(+id, params);
  }

  @Get()
  list(@Query() params: PathNodePaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(@Body() createPathNodeDto: CreatePathNodeDto) {
    const list = await this.modelService.list2();
    if (list.count > 0 && !createPathNodeDto.parentId)
      throw new BadRequestException('parentId cannot be empty or null ');
    const pathNodeModel: PathNodeModel = await this.modelService.create(
      createPathNodeDto,
    );
    if (!pathNodeModel) throw new BadRequestException('Invalid pathNode!');
    return pathNodeModel;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updatePathNodeDto: UpdatePathNodeDto,
  ) {
    return this.modelService.update(+id, updatePathNodeDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string) {
    return this.modelService.delete(+id);
  }
}
