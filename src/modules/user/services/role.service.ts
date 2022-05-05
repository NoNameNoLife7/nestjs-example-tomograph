import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  get role() {
    return this.prisma.role;
  }

  getById(id: number): Promise<role | null> {
    return this.role.findUnique({
      where: { id },
    });
  }

  list(): Promise<role[]> {
    return this.role.findMany();
  }

  create(createRoleDto: CreateRoleDto): Promise<role> {
    return this.role.create({
      data: createRoleDto,
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto): Promise<role> {
    return this.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  delete(id: number): Promise<role> {
    return this.role.delete({ where: { id } });
  }
}
