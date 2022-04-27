import { Injectable } from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from '../../patient/dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { event } from '@prisma/client';

type Model = event;
type CreateData = CreateEventDto;
type UpdateData = UpdateEventDto;

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.event;
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

  create(createEventDto: CreateData): Promise<Model> {
    return this.model.create({ data: createEventDto });
  }

  update(id: number, updateEventDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateEventDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
