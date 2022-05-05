import { Injectable } from '@nestjs/common';
import {
  CreateEquipmentConfigurationDto,
  UpdateEquipmentConfigurationDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { equipmentConfiguration } from '@prisma/client';

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

  list(): Promise<equipmentConfiguration[]> {
    return this.equipmentConfiguration.findMany();
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
