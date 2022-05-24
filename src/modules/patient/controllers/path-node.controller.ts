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
  get(@Param('id') id: string, @Query() params: PathNodeRelation) {
    if (!+id) throw new BadRequestException('The id must be a number');
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
    @Param('id') id: string,
    @Body() updatePathNodeDto: UpdatePathNodeDto,
  ) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.update(+id, updatePathNodeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('The id must be a number');
    return this.modelService.delete(+id);
  }
}
