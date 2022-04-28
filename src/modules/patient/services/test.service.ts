import { Injectable } from '@nestjs/common';
import { CreateTestDto, UpdateTestDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { test } from '@prisma/client';
import {
  EquipmentConfigurationService,
  SoftwareConfigurationService,
} from 'src/modules/configuration/services';

type Model = test;
type CreateData = CreateTestDto;
type UpdateData = UpdateTestDto;

@Injectable()
export class TestService {
  constructor(
    private prisma: PrismaService,

    private softwareConfigurationService: SoftwareConfigurationService,
    private equipmentConfigurationService: EquipmentConfigurationService,
  ) {}

  get model() {
    return this.prisma.test;
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

  create(createTestDto: CreateData): Promise<Model> {
    console.log(createTestDto);
    return this.model.create({ data: createTestDto });
  }

  async update(id: number, updateTestDto: UpdateData): Promise<Model | null> {
    const test = await this.getId(id);
    if (!test) {
      throw Error();
    }

    const {
      softwareConfiguration,
      equipmentConfiguration,
      ...nonForeignRelationFields
    } = updateTestDto;

    if (softwareConfiguration) {
      this.softwareConfigurationService.update(
        test.softwareConfigurationId,
        softwareConfiguration,
      );
    }
    if (equipmentConfiguration) {
      this.equipmentConfigurationService.update(
        test.equipmentConfigurationId,
        equipmentConfiguration,
      );
    }

    return this.model.update({
      where: { id },
      data: nonForeignRelationFields,
    });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
