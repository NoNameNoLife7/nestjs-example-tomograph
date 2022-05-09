import { Injectable } from '@nestjs/common';
import { CreateCommunicationDto, UpdateCommunicationDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { communication } from '@prisma/client';
import { WithPagination } from 'src/common/utils/utils';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.communication;
  }

  getById(id: number): Promise<communication | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async list(): Promise<WithPagination<communication>> {
    //const { orderBy, where, ...otherParams } = params;

    const data: communication[] = await this.model.findMany();
    const count: number = await this.model.count();

    return { count, data };
  }

  create(
    createCommunicationDto: CreateCommunicationDto,
  ): Promise<communication> {
    return this.model.create({ data: createCommunicationDto });
  }

  update(
    id: number,
    updateCommunicationDto: UpdateCommunicationDto,
  ): Promise<communication> {
    return this.model.update({ where: { id }, data: updateCommunicationDto });
  }

  delete(id: number): Promise<communication> {
    return this.model.delete({ where: { id } });
  }
}
