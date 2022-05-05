import { Injectable } from '@nestjs/common';
import {
  CreateSoftwareConfigurationDto,
  UpdateSoftwareConfigurationDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { softwareConfiguration } from '@prisma/client';

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

  list(): Promise<softwareConfiguration[]> {
    return this.softwareConfiguration.findMany();
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
