import { Injectable } from '@nestjs/common';
import {
  CreateTestDto,
  TestPaginationDto,
  TestRelation,
  UpdateTestDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { test } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  get test() {
    return this.prisma.test;
  }

  getById(id: number, params?: TestRelation): Promise<test | null> {
    return this.test.findUnique({ where: { id }, ...params });
  }

  async list(params: TestPaginationDto): Promise<WithPagination<test>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: test[] = await this.test.findMany({
      ...otherParams,
      where,
      include,
      orderBy: { updatedAt: orderBy },
    });
    const count: number = await this.test.count(where);

    return { count, data };
  }

  count() {
    return this.test.count();
  }

  create(createTestDto: CreateTestDto): Promise<test> {
    const {
      softwareConfiguration,
      equipmentConfiguration,
      softwareConfigurationId,
      equipmentConfigurationId,
      ...nonForeignRelationFields
    } = createTestDto;

    const soft = softwareConfigurationId
      ? { connect: { id: softwareConfigurationId } }
      : { create: softwareConfiguration };
    const equip = equipmentConfigurationId
      ? { connect: { id: equipmentConfigurationId } }
      : { create: equipmentConfiguration };

    return this.test.create({
      data: {
        ...nonForeignRelationFields,
        softwareConfiguration: {
          ...soft,
        },
        equipmentConfiguration: {
          ...equip,
        },
      },
    });
  }

  async update(id: number, updateTestDto: UpdateTestDto): Promise<test> {
    const {
      softwareConfiguration,
      equipmentConfiguration,
      softwareConfigurationId,
      equipmentConfigurationId,
      ...nonForeignRelationFields
    } = updateTestDto;

    return this.test.update({
      where: { id },
      data: {
        ...nonForeignRelationFields,
        softwareConfiguration: {
          update: softwareConfiguration
            ? softwareConfiguration
            : softwareConfigurationId,
        },
        equipmentConfiguration: {
          update: equipmentConfiguration
            ? equipmentConfiguration
            : equipmentConfigurationId,
        },
      },
    });
  }

  delete(id: number): Promise<test> {
    return this.test.delete({ where: { id } });
  }
}
