import { Injectable } from '@nestjs/common';
import { CreateImageDto, UpdateImageDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { image } from '@prisma/client';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  get image() {
    return this.prisma.image;
  }

  getById(id: number): Promise<image | null> {
    return this.image.findUnique({
      where: { id },
    });
  }

  list(): Promise<image[]> {
    return this.image.findMany();
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
