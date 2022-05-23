import { Injectable } from '@nestjs/common';
import {
  CreatePathNodeDto,
  PathNodePaginationDto,
  UpdatePathNodeDto,
} from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { pathNode } from '@prisma/client';
import { WithPagination } from 'src/common/utils';

@Injectable()
export class PathNodeService {
  constructor(private prisma: PrismaService) {}

  get pathNode() {
    return this.prisma.pathNode;
  }

  getById(id: number): Promise<pathNode | null> {
    return this.pathNode.findUnique({
      where: { id },
    });
  }

  async list(params: PathNodePaginationDto): Promise<WithPagination<pathNode>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: pathNode[] = await this.pathNode.findMany({
      ...otherParams,
      where,
      include,
    });
    const count: number = await this.pathNode.count(where);

    return { count, data };
  }

  async list2(): Promise<WithPagination<pathNode>> {
    const data: pathNode[] = await this.pathNode.findMany();
    const count: number = await this.pathNode.count();
    return { count, data };
  }

  create(createPathNodeDto: CreatePathNodeDto): Promise<pathNode> {
    const { tests, parentId, ...nonForeignRelationFields } = createPathNodeDto;
    return this.pathNode.create({
      data: {
        ...nonForeignRelationFields,
        parent: { connect: { id: parentId } },
      },
    });
  }

  update(id: number, updatePathNodeDto: UpdatePathNodeDto): Promise<pathNode> {
    const { tests, parentId, ...nonForeignRelationFields } = updatePathNodeDto;
    return this.pathNode.update({
      where: { id },
      data: { ...nonForeignRelationFields },
    });
  }

  delete(id: number): Promise<pathNode> {
    return this.pathNode.delete({ where: { id } });
  }
}