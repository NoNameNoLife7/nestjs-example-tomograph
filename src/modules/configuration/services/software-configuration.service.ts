import { Injectable } from '@nestjs/common';
import {
  CreateSoftwareConfigurationDto,
  UpdateSoftwareConfigurationDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { softwareConfiguration } from '@prisma/client';

type Model = softwareConfiguration;
type CreateData = CreateSoftwareConfigurationDto;
type UpdateData = UpdateSoftwareConfigurationDto;

@Injectable()
export class SoftwareConfigurationService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.softwareConfiguration;
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

  create(createSoftwareConfigurationDto: CreateData): Promise<Model> {
    return this.model.create({ data: createSoftwareConfigurationDto });
  }

  update(
    id: number,
    updateSoftwareConfigurationDto: UpdateData,
  ): Promise<Model | null> {
    return this.model.update({
      where: { id },
      data: updateSoftwareConfigurationDto,
    });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
