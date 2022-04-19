import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { user, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
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
