import { Injectable } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { patient } from '@prisma/client';

type Model = patient;
type CreateData = CreatePatientDto;
type UpdateData = UpdatePatientDto;

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.patient;
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

  create(createPatientDto: CreateData): Promise<Model> {
    return this.model.create({ data: createPatientDto });
  }

  update(id: number, updatePatientDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updatePatientDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
