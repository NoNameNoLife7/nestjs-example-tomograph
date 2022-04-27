import { Injectable } from '@nestjs/common';
import { CreateRecordDto, UpdateRecordDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { record } from '@prisma/client';

type Model = record;
type CreateData = CreateRecordDto;
type UpdateData = UpdateRecordDto;

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.record;
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

  create(createRecordDto: CreateData): Promise<Model> {
    return this.model.create({ data: createRecordDto });
  }

  update(id: number, updateRecordDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateRecordDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
