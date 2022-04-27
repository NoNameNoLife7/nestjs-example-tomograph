import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { user } from '@prisma/client';

type Model = user;
type CreateData = CreateUserDto;
type UpdateData = UpdateUserDto;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  get model() {
    return this.prisma.user;
  }

  async getId(id: number): Promise<Model | null> {
    if (id) {
      return await this.model.findUnique({
        where: { id },
      });
    }
    return null;
  }

  async getUniqueConstrain(email: string): Promise<Model | null> {
    let userModel;
    if (email)
      userModel = await this.model.findUnique({
        where: { email },
      });
    return userModel;
  }

  list(): Promise<Model[]> {
    return this.model.findMany();
  }

  create(createUserDto: CreateData): Promise<Model> {
    return this.model.create({ data: createUserDto });
  }

  update(id: number, updateUserDto: UpdateData): Promise<Model | null> {
    return this.model.update({ where: { id }, data: updateUserDto });
  }

  delete(id: number): Promise<Model | null> {
    return this.model.delete({ where: { id } });
  }
}

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
      include: { user: true },
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
