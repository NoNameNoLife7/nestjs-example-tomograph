import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  create(createRoleDto: CreateRoleDto): Promise<role> {
    return this.prisma.role.create({ data: createRoleDto });
  }

  findAll(): Promise<role[]> {
    return this.prisma.role.findMany();
  }

  findOne(id: number): Promise<role | null> {
    return this.prisma.role.findUnique({ where: { id: id } });
  }

  update(id: number, updateRoleDto: UpdateRoleDto): Promise<role | null> {
    return this.prisma.role.update({ where: { id: id }, data: updateRoleDto });
  }

  remove(id: number): Promise<role | null> {
    return this.prisma.role.delete({ where: { id: id } });
  }
}
