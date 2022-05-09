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
import { ImageService } from '../services';
import { CreateImageDto, ImagePaginationDto, UpdateImageDto } from '../dto';
import { image as ImageModel } from '@prisma/client';

@Controller('image')
export class ImageController {
  constructor(private readonly modelService: ImageService) {}

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
  async create(@Body() createImageDto: CreateImageDto) {
    const imageModel: ImageModel = await this.modelService.create(
      createImageDto,
    );
    if (!imageModel) throw new BadRequestException('Invalid image!');
    return this.modelService.create(createImageDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateImageDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
