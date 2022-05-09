import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserPaginationDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { user } from '@prisma/client';
import { WithPagination } from 'src/common/utils/utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  get user() {
    return this.prisma.user;
  }

  getById(id: number): Promise<user | null> {
    return this.user.findUnique({
      where: { id },
    });
  }

  async list(params: UserPaginationDto): Promise<WithPagination<user>> {
    const { orderBy, where, include, ...otherParams } = params;

    const data: user[] = await this.user.findMany({
      ...otherParams,
      where,
      include,
      orderBy: { lastModified: orderBy },
    });
    const count: number = await this.user.count(where);

    return { count, data };
  }

  create(createUserDto: CreateUserDto): Promise<user> {
    return this.user.create({
      data: createUserDto,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<user> {
    return this.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  delete(id: number): Promise<user> {
    return this.user.delete({ where: { id } });
  }
}
