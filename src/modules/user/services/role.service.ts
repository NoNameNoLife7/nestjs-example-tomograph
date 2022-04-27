import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { role } from '@prisma/client';

type Model = role;
type CreateData = CreateRoleDto;
type UpdateData = UpdateRoleDto;

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.role;
  }

  async getId(id: number): Promise<Model | null> {
    if (id) {
      return await this.model.findUnique({
        where: { id },
      });
    }
    return null;
  }

  async getUniqueConstrain(name: string): Promise<Model | null> {
    let roleModel;
    if (name)
      roleModel = await this.model.findUnique({
        where: { name },
      });
    return roleModel;
  }

  list(): Promise<Model[]> {
    return this.model.findMany();
  }

  create(createRoleDto: CreateData): Promise<Model> {
    return this.model.create({ data: createRoleDto });
  }

  update(id: number, updateRoleDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateRoleDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}
