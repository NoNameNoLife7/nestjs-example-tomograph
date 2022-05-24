import { Injectable } from '@nestjs/common';
import {
  CreateLogDto,
  LogPaginationDto,
  LogRelation,
  UpdateLogDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { log } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

type Model = log;
type CreateData = CreateLogDto;
type UpdateData = UpdateLogDto;

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.log;
  }

  async getById(id: number, params?: LogRelation): Promise<Model | null> {
    return await this.model.findUnique({
      where: { id },
      ...params,
    });
  }

  async list(params: LogPaginationDto): Promise<WithPagination<Model>> {
    const { orderBy, where, ...otherParams } = params;

    const data = await this.model.findMany({
      ...otherParams,
      where,
      orderBy: { updatedAt: orderBy },
    });
    const count: number = await this.model.count(where);

    return { count, data };
  }

  create(createLogDto: CreateData): Promise<Model> {
    return this.model.create({ data: createLogDto });
  }

  update(id: number, updateLogDto: UpdateData): Promise<Model> {
    return this.model.update({ where: { id }, data: updateLogDto });
  }

  delete(id: number): Promise<Model> {
    return this.model.delete({ where: { id } });
  }
}
