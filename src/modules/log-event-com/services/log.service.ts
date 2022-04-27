import { Injectable } from '@nestjs/common';
import { CreateLogDto, UpdateLogDto } from '../../patient/dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { log } from '@prisma/client';

type Model = log;
type CreateData = CreateLogDto;
type UpdateData = UpdateLogDto;

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.log;
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

  create(createLogDto: CreateData): Promise<Model> {
    return this.model.create({ data: createLogDto });
  }

  update(id: number, updateLogDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateLogDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
