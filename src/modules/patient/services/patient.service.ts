import { Injectable } from '@nestjs/common';
import {
  CreatePatientDto,
  PatientPaginationDto,
  UpdatePatientDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { patient } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  get patient() {
    return this.prisma.patient;
  }

  getById(id: number): Promise<patient | null> {
    return this.patient.findUnique({
      where: { id },
    });
  }

  async list(params: PatientPaginationDto): Promise<WithPagination<patient>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: patient[] = await this.patient.findMany({
      ...otherParams,
      where,
      include,
      orderBy: { updatedAt: orderBy },
    });
    const count: number = await this.patient.count(where);

    return { count, data };
  }

  create(createPatientDto: CreatePatientDto): Promise<patient> {
    return this.patient.create({
      data: createPatientDto,
    });
  }

  update(id: number, updatePatientDto: UpdatePatientDto): Promise<patient> {
    return this.patient.update({
      where: { id },
      data: updatePatientDto,
    });
  }

  delete(id: number): Promise<patient> {
    return this.patient.delete({ where: { id } });
  }
}
