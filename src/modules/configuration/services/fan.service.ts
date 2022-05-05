import { Injectable } from '@nestjs/common';
import { CreateFanDto, UpdateFanDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { fan } from '@prisma/client';

@Injectable()
export class FanService {
  constructor(private prisma: PrismaService) {}

  get fan() {
    return this.prisma.fan;
  }

  getById(id: number): Promise<fan | null> {
    return this.fan.findUnique({
      where: { id },
    });
  }

  list(): Promise<fan[]> {
    return this.fan.findMany();
  }

  create(createFanDto: CreateFanDto): Promise<fan> {
    return this.fan.create({
      data: createFanDto,
    });
  }

  update(id: number, updateFanDto: UpdateFanDto): Promise<fan> {
    return this.fan.update({
      where: { id },
      data: updateFanDto,
    });
  }

  delete(id: number): Promise<fan> {
    return this.fan.delete({ where: { id } });
  }
}
