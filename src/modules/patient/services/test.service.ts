import { Injectable } from '@nestjs/common';
import { CreateTestDto, UpdateTestDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { test } from '@prisma/client';

type Model = test;
type CreateData = CreateTestDto;
type UpdateData = UpdateTestDto;

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

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

  update(id: number, updateTestDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateTestDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
