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
import { ImageService } from '../services';
import {
  CreateImageDto,
  ImagePaginationDto,
  ImageRelation,
  UpdateImageDto,
} from '../dto';
import { image as ImageModel } from '@prisma/client';

@Controller('image')
export class ImageController {
  constructor(private readonly modelService: ImageService) {}

  private async getInstanceOr404(id: number, params?: ImageRelation) {
    const instance = await this.modelService.getById(id, params ?? params);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(
    @Param('id', new ParseIntPipe()) id: string,
    @Query() params: ImageRelation,
  ) {
    return this.getInstanceOr404(+id, params);
  }

  @Get()
  list(@Query() params: ImagePaginationDto) {
    return this.modelService.list(params);
  }

  @Post()
  async create(@Body() createImageDto: CreateImageDto) {
    const imageModel: ImageModel = await this.modelService.create(
      createImageDto,
    );
    if (!imageModel) throw new BadRequestException('Invalid image!');
    return imageModel;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.modelService.update(+id, updateImageDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: string) {
    return this.modelService.delete(+id);
  }
}
