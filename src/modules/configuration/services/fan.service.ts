import { Injectable } from '@nestjs/common';
import { CreateVentilatorDto, UpdateVentilatorDto } from '../../patient/dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { ventilator } from '@prisma/client';

type Model = ventilator;
type CreateData = CreateVentilatorDto;
type UpdateData = UpdateVentilatorDto;

@Injectable()
export class FanService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.ventilator;
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

  create(createVentilatorDto: CreateData): Promise<Model> {
    return this.model.create({ data: createVentilatorDto });
  }

  update(id: number, updateVentilatorDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateVentilatorDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
