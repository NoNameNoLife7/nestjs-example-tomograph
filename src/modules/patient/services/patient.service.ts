import { Injectable } from '@nestjs/common';
import { CreatePatientDto, UpdatePatientDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { patient } from '@prisma/client';

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

  list(): Promise<patient[]> {
    return this.patient.findMany();
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
