import { Injectable } from '@nestjs/common';
import {
  CreateRecordDto,
  RecordPaginationDto,
  RecordRelation,
  UpdateRecordDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { record } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  get record() {
    return this.prisma.record;
  }

  getById(id: number, params?: RecordRelation): Promise<record | null> {
    return this.record.findUnique({
      where: { id },
      ...params,
    });
  }

  async list(params: RecordPaginationDto): Promise<WithPagination<record>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: record[] = await this.record.findMany({
      ...otherParams,
      where,
      include,
      orderBy: { updatedAt: orderBy },
    });
    const count: number = await this.record.count(where);

    return { count, data };
  }

  create(createRecordDto: CreateRecordDto): Promise<record> {
    return this.record.create({
      data: createRecordDto,
    });
  }

  update(id: number, updateRecordDto: UpdateRecordDto): Promise<record> {
    return this.record.update({
      where: { id },
      data: updateRecordDto,
    });
  }

  delete(id: number): Promise<record> {
    return this.record.delete({ where: { id } });
  }
}
