import { Injectable } from '@nestjs/common';
import { CreateImageDto, UpdateImageDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { image } from '@prisma/client';

type Model = image;
type CreateData = CreateImageDto;
type UpdateData = UpdateImageDto;

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.image;
  }

  async getId(id: number): Promise<Model | null> {
    if (id) {
      return await this.model.findUnique({
        where: { id },
      });
    }
    return null;
  }

  list(): Promise<Model[]> {
    return this.model.findMany();
  }

  create(createImageDto: CreateData): Promise<Model> {
    return this.model.create({ data: createImageDto });
  }

  update(id: number, updateImageDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateImageDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
