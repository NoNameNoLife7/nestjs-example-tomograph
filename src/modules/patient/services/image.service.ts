import { Injectable } from '@nestjs/common';
import {
  CreateImageDto,
  ImagePaginationDto,
  ImageRelation,
  UpdateImageDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { image } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  get image() {
    return this.prisma.image;
  }

  getById(id: number, params?: ImageRelation): Promise<image | null> {
    return this.image.findUnique({
      where: { id },
      ...params,
    });
  }

  async list(params: ImagePaginationDto): Promise<WithPagination<image>> {
    const { orderBy, where, include, date, file, testId, ...otherParams } =
      params;

    const data: image[] = await this.image.findMany({
      ...otherParams,
      where: {
        date,
        file,
        testId,
      },
      include,
      orderBy: { updatedAt: orderBy },
    });
    const count: number = await this.image.count(where);

    return { count, data };
  }

  create(createImageDto: CreateImageDto): Promise<image> {
    return this.image.create({
      data: createImageDto,
    });
  }

  update(id: number, updateImageDto: UpdateImageDto): Promise<image> {
    return this.image.update({
      where: { id },
      data: updateImageDto,
    });
  }

  delete(id: number): Promise<image> {
    return this.image.delete({ where: { id } });
  }
}
