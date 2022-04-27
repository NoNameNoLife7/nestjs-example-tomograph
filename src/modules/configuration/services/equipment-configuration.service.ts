import { Injectable } from '@nestjs/common';
import {
  CreateEquipmentConfigurationDto,
  UpdateEquipmentConfigurationDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { equipmentConfiguration } from '@prisma/client';

type Model = equipmentConfiguration;
type CreateData = CreateEquipmentConfigurationDto;
type UpdateData = UpdateEquipmentConfigurationDto;

@Injectable()
export class EquipmentConfigurationService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.equipmentConfiguration;
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

  create(createEquipmentConfigurationDto: CreateData): Promise<Model> {
    return this.model.create({ data: createEquipmentConfigurationDto });
  }

  update(
    id: number,
    updateEquipmentConfigurationDto: UpdateData,
  ): Promise<Model | null> {
    return this.model.update({
      where: { id },
      data: updateEquipmentConfigurationDto,
    });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
