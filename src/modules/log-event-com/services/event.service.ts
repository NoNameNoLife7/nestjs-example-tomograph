import { Injectable } from '@nestjs/common';
import {
  CreateEventDto,
  EventPaginationDto,
  EventRelation,
  UpdateEventDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { event } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

type Model = event;
type CreateData = CreateEventDto;
type UpdateData = UpdateEventDto;

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.event;
  }

  getById(id: number, params?: EventRelation): Promise<Model | null> {
    return this.model.findUnique({
      where: { id },
      ...params,
    });
  }

  async list(params: EventPaginationDto): Promise<WithPagination<Model>> {
    const { orderBy, where, ...otherParams } = params;

    const data = await this.model.findMany({
      ...otherParams,
      where,
      orderBy: { updatedAt: orderBy },
    });
    const count: number = await this.model.count(where);

    return { count, data };
  }

  async listByEventType(
    params: EventPaginationDto,
  ): Promise<WithPagination<Model>> {
    const { orderBy, where, ...otherParams } = params;

    const data = await this.model.findMany({
      ...otherParams,
      where,
      orderBy: { updatedAt: orderBy },
    });

    const count: number = await this.model.count(where);

    return { count, data };
  }

  create(createEventDto: CreateData): Promise<Model> {
    return this.model.create({ data: createEventDto });
  }

  update(id: number, updateEventDto: UpdateData): Promise<Model> {
    return this.model.update({ where: { id }, data: updateEventDto });
  }

  delete(id: number): Promise<Model> {
    return this.model.delete({ where: { id } });
  }
}
