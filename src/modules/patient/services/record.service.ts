import { Injectable } from '@nestjs/common';
import { CreateRecordDto, UpdateRecordDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { record } from '@prisma/client';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  get record() {
    return this.prisma.record;
  }

  getById(id: number): Promise<record | null> {
    return this.record.findUnique({
      where: { id },
    });
  }

  list(): Promise<record[]> {
    return this.record.findMany();
  }

  create(createRecordDto: CreateRecordDto): Promise<record> {
    return this.record.create({
      data: createRecordDto,
    });
  }

  update(id: number, updateRecordDto: UpdateRecordDto): Promise<record> {
    return this.record.update({
      where: { id },
      data: updateRecordDto,
    });
  }

  delete(id: number): Promise<record> {
    return this.record.delete({ where: { id } });
  }
}
