import { Injectable } from '@nestjs/common';
import { CreateFanDto, FanPaginationDto, UpdateFanDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { fan } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

@Injectable()
export class FanService {
  constructor(private prisma: PrismaService) {}

  get fan() {
    return this.prisma.fan;
  }

  getById(id: number): Promise<fan | null> {
    return this.fan.findUnique({
      where: { id },
    });
  }

  async list(params: FanPaginationDto): Promise<WithPagination<fan>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: fan[] = await this.fan.findMany({
      ...otherParams,
      where,
      include,
      orderBy: { updatedAt: orderBy },
    });
    const count: number = await this.fan.count(where);

    return { count, data };
  }

  create(createFanDto: CreateFanDto): Promise<fan> {
    return this.fan.create({
      data: createFanDto,
    });
  }

  update(id: number, updateFanDto: UpdateFanDto): Promise<fan> {
    return this.fan.update({
      where: { id },
      data: updateFanDto,
    });
  }

  delete(id: number): Promise<fan> {
    return this.fan.delete({ where: { id } });
  }
}
