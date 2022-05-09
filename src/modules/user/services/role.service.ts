import { Injectable } from '@nestjs/common';
import { CreateRoleDto, RolePaginationDto, UpdateRoleDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { role } from '@prisma/client';
import { WithPagination } from 'src/common/utils/utils';

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

  async list(params: RolePaginationDto): Promise<WithPagination<role>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: role[] = await this.role.findMany({
      ...otherParams,
      where,
      include,
      orderBy: { lastModified: orderBy },
    });
    const count: number = await this.role.count(where);

    return { count, data };
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
