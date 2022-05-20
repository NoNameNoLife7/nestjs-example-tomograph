import { Injectable } from '@nestjs/common';
import {
  CreateSoftwareConfigurationDto,
  SoftwareConfigurationPaginationDto,
  UpdateSoftwareConfigurationDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { softwareConfiguration } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

@Injectable()
export class SoftwareConfigurationService {
  constructor(private prisma: PrismaService) {}

  get softwareConfiguration() {
    return this.prisma.softwareConfiguration;
  }

  getById(id: number): Promise<softwareConfiguration | null> {
    return this.softwareConfiguration.findUnique({
      where: { id },
    });
  }
  getLastSoftwareConfiguration(): Promise<softwareConfiguration[]> {
    return this.softwareConfiguration.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      take: 1,
    });
  }
  async list(
    params: SoftwareConfigurationPaginationDto,
  ): Promise<WithPagination<softwareConfiguration>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: softwareConfiguration[] =
      await this.softwareConfiguration.findMany({
        ...otherParams,
        where,
        include,
        orderBy: { updatedAt: orderBy },
      });
    const count: number = await this.softwareConfiguration.count(where);

    return { count, data };
  }

  create(
    createSoftwareConfigurationDto: CreateSoftwareConfigurationDto,
  ): Promise<softwareConfiguration> {
    return this.softwareConfiguration.create({
      data: createSoftwareConfigurationDto,
    });
  }

  update(
    id: number,
    updateSoftwareConfigurationDto: UpdateSoftwareConfigurationDto,
  ): Promise<softwareConfiguration> {
    return this.softwareConfiguration.update({
      where: { id },
      data: updateSoftwareConfigurationDto,
    });
  }

  delete(id: number): Promise<softwareConfiguration> {
    return this.softwareConfiguration.delete({ where: { id } });
  }
}
