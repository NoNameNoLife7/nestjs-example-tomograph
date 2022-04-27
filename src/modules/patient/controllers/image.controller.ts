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
import { ImageService } from '../services';
import { CreateImageDto, UpdateImageDto } from '../dto';
import { image as ImageModel } from '@prisma/client';

type CreateData = CreateImageDto;
type UpdateData = UpdateImageDto;

@Controller('images')
export class ImageController {
  constructor(private readonly modelService: ImageService) {}

  private async getInstanceOr404(id: number): Promise<ImageModel> {
    const instance = await this.modelService.getId(id);
    if (!instance) throw new NotFoundException();
    return instance;
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<ImageModel | null> {
    return this.modelService.getId(+id);
  }

  @Get()
  list(): Promise<ImageModel[]> {
    return this.modelService.list();
  }

  @Post()
  async create(
    @Body() createImageDto: CreateData,
  ): Promise<ImageModel | Error> {
    const imageModel: ImageModel = await this.modelService.create(
      createImageDto,
    );
    if (!imageModel) {
      throw new BadRequestException('Invalid image!');
    }
    return this.modelService.create(createImageDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateData,
  ): Promise<ImageModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.update(+id, updateImageDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ImageModel | null> {
    await this.getInstanceOr404(+id);
    return this.modelService.delete(+id);
  }
}
