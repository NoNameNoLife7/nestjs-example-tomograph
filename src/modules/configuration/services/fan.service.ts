import { Injectable } from '@nestjs/common';
import { CreateFanDto, UpdateFanDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { fan } from '@prisma/client';

type Model = fan;
type CreateData = CreateFanDto;
type UpdateData = UpdateFanDto;

@Injectable()
export class FanService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.fan;
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

  create(createFanDto: CreateData): Promise<Model> {
    return this.model.create({ data: createFanDto });
  }

  update(id: number, updateFanDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateFanDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
