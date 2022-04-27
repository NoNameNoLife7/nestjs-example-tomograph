import { Injectable } from '@nestjs/common';
import { CreateCommunicationDto, UpdateCommunicationDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { communication } from '@prisma/client';

type Model = communication;
type CreateData = CreateCommunicationDto;
type UpdateData = UpdateCommunicationDto;

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.communication;
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

  create(createCommunicationDto: CreateData): Promise<Model> {
    return this.model.create({ data: createCommunicationDto });
  }

  update(
    id: number,
    updateCommunicationDto: UpdateData,
  ): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateCommunicationDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
