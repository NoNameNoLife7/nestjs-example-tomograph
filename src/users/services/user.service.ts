/*
import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { user, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<user> {
    return await this.prisma.user.create({ data: data });
  }

  async findAll(): Promise<user[]> {
    return this.prisma.user.findMany({
      include: { role: true },
    });
  }

  async findById(id: number): Promise<user | null> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async findOne(
    userWhereUniqueInput: Prisma.userWhereUniqueInput,
  ): Promise<user | null> {
    const result = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    console.log('Result', result);

    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  update(id: number, data: UpdateUserDto): Promise<user | null> {
    return this.prisma.user.update({ where: { id: id }, data });
  }

  remove(id: number): Promise<user | null> {
    return this.prisma.user.delete({ where: { id: id } });
  }
}
*/

import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { Prisma, user } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserTypeMap } from '../typeMap/user.type.map';

@Injectable()
export class UserService extends BaseService<
  Prisma.userDelegate<user>,
  UserTypeMap
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }
  /* added the prisma.user (which is a Prisma.UserDelegate) within the constructor. This is somehow comparable to the repository known from typeorm. It gives access to the underlying methods, like create(), update()*/
}