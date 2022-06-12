import { Injectable } from '@nestjs/common';
import { CreateFanDto, FanPaginationDto, UpdateFanDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { fan } from '@prisma/client';
import { WithPagination } from 'src/common/utils';
import { FanRelation } from '../dto/fan.dto';

@Injectable()
export class FanService {
  constructor(private prisma: PrismaService) {}

  get fan() {
    return this.prisma.fan;
  }

  getById(id: number, params?: FanRelation): Promise<fan | null> {
    return this.fan.findUnique({
      where: { id },
      ...params,
    });
  }

  async list(params: FanPaginationDto): Promise<WithPagination<fan>> {
    const { orderBy, where, include, model, name, protocol, ...otherParams } =
      params;

    const data: fan[] = await this.fan.findMany({
      ...otherParams,
      where: {
        model: {
          contains: model,
        },
        name: {
          contains: name,
        },
        protocol: {
          contains: protocol,
        },
      },
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
