import { Injectable } from '@nestjs/common';
import {
  CreateEquipmentConfigurationDto,
  EquipmentConfigurationPaginationDto,
  UpdateEquipmentConfigurationDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { equipmentConfiguration } from '@prisma/client';
import { WithPagination } from 'src/common/utils/utils';

@Injectable()
export class EquipmentConfigurationService {
  constructor(private prisma: PrismaService) {}

  get equipmentConfiguration() {
    return this.prisma.equipmentConfiguration;
  }

  getById(id: number): Promise<equipmentConfiguration | null> {
    return this.equipmentConfiguration.findUnique({
      where: { id },
    });
  }

  async list(
    params: EquipmentConfigurationPaginationDto,
  ): Promise<WithPagination<equipmentConfiguration>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: equipmentConfiguration[] =
      await this.equipmentConfiguration.findMany({
        ...otherParams,
        where,
        include,
        orderBy: { lastModified: orderBy },
      });
    const count: number = await this.equipmentConfiguration.count(where);

    return { count, data };
  }

  lastConfiguration(): Promise<equipmentConfiguration[]> {
    return this.equipmentConfiguration.findMany({
      orderBy: {
        lastModified: 'desc',
      },
      take: 1,
    });
  }

  create(
    createEquipmentConfigurationDto: CreateEquipmentConfigurationDto,
  ): Promise<equipmentConfiguration> {
    return this.equipmentConfiguration.create({
      data: createEquipmentConfigurationDto,
    });
  }

  update(
    id: number,
    updateEquipmentConfigurationDto: UpdateEquipmentConfigurationDto,
  ): Promise<equipmentConfiguration> {
    return this.equipmentConfiguration.update({
      where: { id },
      data: updateEquipmentConfigurationDto,
    });
  }

  delete(id: number): Promise<equipmentConfiguration> {
    return this.equipmentConfiguration.delete({ where: { id } });
  }
}
