import { Injectable } from '@nestjs/common';
import {
  CreatePatientDto,
  PatientPaginationDto,
  PatientRelation,
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

  getById(id: number, params: PatientRelation): Promise<patient | null> {
    return this.patient.findUnique({
      where: { id },
      ...params,
    });
  }

  async list(params: PatientPaginationDto): Promise<WithPagination<patient>> {
    const {
      orderBy,
      where,
      include,
      firstName,
      lastName,
      sex,
      date,
      active,
      comorbidities,
      diagnostic,
      hospitalCode,
      size,
      skinColor,
      weight,
      ...otherParams
    } = params;

    const data: patient[] = await this.patient.findMany({
      ...otherParams,
      where: {
        firstName: {
          contains: firstName,
        },
        lastName: {
          contains: lastName,
        },
        sex,
        date,
        active,
        comorbidities: {
          contains: comorbidities,
        },
        diagnostic: {
          contains: diagnostic,
        },
        hospitalCode,
        size,
        skinColor,
        weight,
      },
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
